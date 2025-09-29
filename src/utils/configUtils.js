import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { createFolder } from './pathUtils.js';
import { ConfigError } from '../models/errors/ConfigError.js';

// Configuration file path - shared across the application
export const CONFIG_PATH = path.join(os.homedir(), '.projecttools', 'config.json');
const BACKUP_PATH = CONFIG_PATH + '.backup';

// Configuration cache
let configCache = null;
let cacheTimestamp = null;

/**
 * Validate configuration structure against schema
 * @param {Object} config - Configuration object to validate
 * @throws {ConfigError} When configuration is invalid
 */
function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new ConfigError('Configuration must be an object', 'INVALID_TYPE');
  }

  const requiredProps = ['appVersion', 'settings', 'profiles', 'workspaces', 'projects'];
  for (const prop of requiredProps) {
    if (!(prop in config)) {
      throw new ConfigError(`Missing required property: ${prop}`, 'MISSING_PROPERTY');
    }
  }

  if (typeof config.appVersion !== 'string') {
    throw new ConfigError('appVersion must be a string', 'INVALID_TYPE');
  }
  
  if (!config.settings || typeof config.settings !== 'object') {
    throw new ConfigError('settings must be an object', 'INVALID_TYPE');
  }
  
  if (typeof config.settings.defaultProjectsPath !== 'string') {
    throw new ConfigError('settings.defaultProjectsPath must be a string', 'INVALID_TYPE');
  }
  
  if (typeof config.settings.firstTimeSetup !== 'boolean') {
    throw new ConfigError('settings.firstTimeSetup must be a boolean', 'INVALID_TYPE');
  }
  
  if (config.activeProfile !== null && typeof config.activeProfile !== 'string') {
    throw new ConfigError('activeProfile must be a string or null', 'INVALID_TYPE');
  }
  
  if (!Array.isArray(config.profiles)) {
    throw new ConfigError('profiles must be an array', 'INVALID_TYPE');
  }
  
  if (!Array.isArray(config.workspaces)) {
    throw new ConfigError('workspaces must be an array', 'INVALID_TYPE');
  }
  
  if (!Array.isArray(config.projects)) {
    throw new ConfigError('projects must be an array', 'INVALID_TYPE');
  }
}

// Default configuration
export const DEFAULT_CONFIG = {
  appVersion: '0.1.1',
  settings: {
    defaultProjectsPath: path.join(os.homedir(), 'Dev'),
    firstTimeSetup: false
  },
  activeProfile: null,
  profiles: [],
  workspaces: [],
  projects: []
};

/**
 * Load configuration from file with caching and validation
 * @param {boolean} forceReload - Force reload from disk, bypassing cache
 * @returns {Promise<Object>} Configuration object
 * @throws {ConfigError} When configuration is invalid or cannot be loaded
 */
export async function loadConfig(forceReload = false) {
  try {
    if (!await fs.pathExists(CONFIG_PATH)) {
      throw new ConfigError('Configuration file not found. Run initialization first.', 'CONFIG_NOT_FOUND');
    }

    const stats = await fs.stat(CONFIG_PATH);
    
    if (!forceReload && configCache && cacheTimestamp && cacheTimestamp >= stats.mtime) {
      return configCache;
    }

    const config = await fs.readJSON(CONFIG_PATH);
    validateConfig(config);
    
    configCache = config;
    cacheTimestamp = stats.mtime;
    
    return config;
  } catch (error) {
    if (error instanceof ConfigError) {
      throw error;
    }
    if (error.code === 'ENOENT') {
      throw new ConfigError('Configuration file not found. Run initialization first.', 'CONFIG_NOT_FOUND');
    }
    if (error.code === 'EACCES') {
      throw new ConfigError('Permission denied accessing configuration file', 'PERMISSION_DENIED', error);
    }
    if (error.name === 'SyntaxError') {
      throw new ConfigError('Configuration file contains invalid JSON', 'INVALID_JSON', error);
    }
    throw new ConfigError(`Failed to load configuration: ${error.message}`, 'LOAD_ERROR', error);
  }
}

/**
 * Save configuration to file with validation, backup, and atomic writes
 * @param {Object} config - Configuration object to save
 * @throws {ConfigError} When configuration cannot be saved
 */
export async function saveConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new ConfigError('Invalid configuration object', 'INVALID_CONFIG');
  }

  try {
    validateConfig(config);
    
    await fs.ensureDir(path.dirname(CONFIG_PATH));
    
    // Create backup if config exists
    if (await fs.pathExists(CONFIG_PATH)) {
      try {
        await fs.copy(CONFIG_PATH, BACKUP_PATH);
      } catch (backupError) {
        console.warn('Failed to create backup:', backupError.message);
      }
    }
    
    const tempPath = CONFIG_PATH + '.tmp';
    await fs.writeJSON(tempPath, config, { spaces: 2, mode: 0o600 });
    await fs.move(tempPath, CONFIG_PATH);
    await fs.chmod(CONFIG_PATH, 0o600);
    
    // Update cache
    configCache = config;
    cacheTimestamp = new Date();
    
  } catch (error) {
    if (error instanceof ConfigError) {
      throw error;
    }
    if (error.code === 'EACCES') {
      throw new ConfigError('Permission denied writing configuration file', 'PERMISSION_DENIED', error);
    }
    if (error.code === 'ENOSPC') {
      throw new ConfigError('Insufficient disk space to save configuration', 'DISK_FULL', error);
    }
    throw new ConfigError(`Failed to save configuration: ${error.message}`, 'SAVE_ERROR', error);
  }
}

/**
 * Initialize configuration file if it doesn't exist
 * @returns {Promise<boolean>} True if config was created, false if it already existed
 * @throws {ConfigError} When initialization fails
 */
export async function initConfig() {
  try {
    await fs.ensureDir(path.dirname(CONFIG_PATH));
    
    if (!await fs.pathExists(CONFIG_PATH)) {
      validateConfig(DEFAULT_CONFIG);
      
      try {
        await createFolder(DEFAULT_CONFIG.settings.defaultProjectsPath);
      } catch (folderError) {
        console.warn(`Warning: Could not create default projects directory: ${folderError.message}`);
      }
      
      await saveConfig(DEFAULT_CONFIG);
      return true;
    }
    
    try {
      await loadConfig(true);
    } catch (validationError) {
      throw new ConfigError(`Existing configuration is invalid: ${validationError.message}`, 'INVALID_EXISTING_CONFIG', validationError);
    }
    
    return false;
  } catch (error) {
    if (error instanceof ConfigError) {
      throw error;
    }
    if (error.code === 'EACCES') {
      throw new ConfigError('Permission denied during configuration initialization', 'PERMISSION_DENIED', error);
    }
    throw new ConfigError(`Failed to initialize configuration: ${error.message}`, 'INIT_ERROR', error);
  }
}

/**
 * Get configuration file path
 * @returns {string} Path to configuration file
 */
export function getConfigPath() {
  return CONFIG_PATH;
}

/**
 * Get configuration backup file path
 * @returns {string} Path to configuration backup file
 */
export function getBackupPath() {
  return BACKUP_PATH;
}

/**
 * Restore configuration from backup
 * @returns {Promise<boolean>} True if backup was restored, false if no backup exists
 * @throws {ConfigError} When restore operation fails
 */
export async function restoreFromBackup() {
  try {
    if (!await fs.pathExists(BACKUP_PATH)) {
      return false;
    }
    
    const backupConfig = await fs.readJSON(BACKUP_PATH);
    validateConfig(backupConfig);
    
    await fs.copy(BACKUP_PATH, CONFIG_PATH);
    
    // Clear cache to force reload
    configCache = null;
    cacheTimestamp = null;
    
    return true;
  } catch (error) {
    if (error instanceof ConfigError) {
      throw error;
    }
    throw new ConfigError(`Failed to restore from backup: ${error.message}`, 'RESTORE_ERROR', error);
  }
}

/**
 * Clear configuration cache
 * Forces next loadConfig() call to read from disk
 */
export function clearCache() {
  configCache = null;
  cacheTimestamp = null;
}