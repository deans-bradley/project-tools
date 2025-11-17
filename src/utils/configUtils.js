import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { Config, Settings, BusinessError } from '../models/index.js';
import { CONFIG_ERROR } from '../models/constants/index.js';

// Configuration file path - shared across the application
export const CONFIG_PATH = path.join(os.homedir(), '.projecttools', 'config.json');
const BACKUP_PATH = CONFIG_PATH + '.backup';

// Configuration cache
let configCache = null;
let cacheTimestamp = null;

// Default configuration
export const DEFAULT_CONFIG = new Config({
  appVersion: '0.1.1',
  firstTimeSetup: false,
  settings: new Settings({
    defaultProjectsPath: path.join(os.homedir(), 'Dev')
  }),
  profiles: []
});

/**
 * Load configuration from file with caching and validation
 * @param {boolean} forceReload - Force reload from disk, bypassing cache
 * @returns {Promise<Config>} Configuration object
 * @throws {BusinessError} When configuration is invalid or cannot be loaded
 */
export async function loadConfig(forceReload = false) {
  try {
    const stats = await fs.stat(CONFIG_PATH);
    
    if (!forceReload && configCache && cacheTimestamp && cacheTimestamp >= stats.mtime) {
      return configCache;
    }

    const configData = await fs.readJSON(CONFIG_PATH);
    const config = Config.fromJSON(configData);
    
    configCache = config;
    cacheTimestamp = stats.mtime;
    
    return config;
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    if (error.code === 'ENOENT') {
      throw new BusinessError(CONFIG_ERROR.NOT_FOUND);
    }
    if (error.code === 'EACCES') {
      throw new BusinessError(CONFIG_ERROR.PERMISSION_DENIED, null, error);
    }
    if (error.name === 'SyntaxError') {
      throw new BusinessError(CONFIG_ERROR.INVALID_JSON, null, error);
    }

    throw new BusinessError(CONFIG_ERROR.LOAD_ERROR, null, error);
  }
}

/**
 * Save configuration to file with backup and atomic writes
 * @param {Config} config - Configuration object to save
 * @throws {BusinessError} When configuration cannot be saved
 */
export async function saveConfig(config) {
  if (!(config instanceof Config)) {
    throw new BusinessError(CONFIG_ERROR.INVALID_CONFIG);
  }

  try {
    await fs.ensureDir(path.dirname(CONFIG_PATH));

    if (await fs.pathExists(CONFIG_PATH)) {
      try {
        await fs.copy(CONFIG_PATH, BACKUP_PATH);
      } catch (error) {
        console.warn('Failed to create backup: ', error.message);
      }
    }
    
    const tempPath = CONFIG_PATH + '.tmp';
    await fs.writeJSON(tempPath, config.toJSON(), { spaces: 2, mode: 0o600 });
    await fs.move(tempPath, CONFIG_PATH, { overwrite: true });
    await fs.chmod(CONFIG_PATH, 0o600);
    
    // Update cache
    configCache = config;
    cacheTimestamp = new Date();
    
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    if (error.code === 'EACCES') {
      throw new BusinessError(CONFIG_ERROR.PERMISSION_DENIED, null, error);
    }
    if (error.code === 'ENOSPC') {
      throw new BusinessError(CONFIG_ERROR.DISK_FULL, null,  error);
    }
    throw new BusinessError(CONFIG_ERROR.SAVE_ERROR, null, error);
  }
}

/**
 * Initialize configuration file if it doesn't exist
 * @returns {Promise<boolean>} True if config was created, false if it already existed
 * @throws {BusinessError} When initialization fails
 */
export async function initConfig() {
  try {
    if (!await fs.pathExists(CONFIG_PATH)) {
      await saveConfig(DEFAULT_CONFIG);
      return true;
    }
    
    try {
      await loadConfig(true);
    } catch (error) {
      throw new BusinessError(CONFIG_ERROR.INVALID_EXISTING_CONFIG, null, error);
    }
    
    return false;
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    if (error.code === 'EACCES') {
      throw new BusinessError(CONFIG_ERROR.PERMISSION_DENIED, null, error);
    }
    throw new BusinessError(CONFIG_ERROR.INIT_ERROR, null, error);
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
 * @throws {BusinessError} When restore operation fails
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
    if (error instanceof BusinessError) {
      throw error;
    }
    throw new BusinessError(CONFIG_ERROR.RESTORE_ERROR, null, error);
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