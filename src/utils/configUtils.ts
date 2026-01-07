import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { ERROR_TYPE } from '../models/constants/index';
import { BusinessError, Config, ConfigError, Settings } from '../models/index';

// Configuration file path - shared across the application
export const CONFIG_PATH = path.join(os.homedir(), '.projecttools', 'config.json');
const BACKUP_PATH = CONFIG_PATH + '.backup';

// Configuration cache
let configCache: Config | null = null;
let cacheTimestamp: Date | null = null;

// Default configuration
export const DEFAULT_CONFIG = new Config(
  new Settings(path.join(os.homedir(), 'Dev'))
);

/**
 * Load configuration from file with caching and validation
 * @throws {BusinessError} When configuration is invalid or cannot be loaded
 */
export async function loadConfig(forceReload: boolean = false): Promise<Config> {
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
  } catch (error: any) {
    if (error instanceof BusinessError) {
      throw error;
    }
    if (error.code === 'ENOENT') {
      throw new ConfigError(ERROR_TYPE.NOT_FOUND);
    }
    if (error.code === 'EACCES') {
      throw new ConfigError(ERROR_TYPE.ACCESS_DENIED);
    }
    if (error.name === 'SyntaxError') {
      throw new ConfigError(ERROR_TYPE.INVALID_JSON);
    }

    throw new ConfigError(ERROR_TYPE.READ_ERROR);
  }
}

/**
 * Save configuration to file with backup and atomic writes
 * @throws {BusinessError} When configuration cannot be saved
 */
export async function saveConfig(config: Config): Promise<void> {
  if (!(config instanceof Config)) {
    throw new ConfigError(ERROR_TYPE.INVALID_VALUE);
  }

  try {
    await fs.ensureDir(path.dirname(CONFIG_PATH));

    if (await fs.pathExists(CONFIG_PATH)) {
      try {
        await fs.copy(CONFIG_PATH, BACKUP_PATH);
      } catch (error: any) {
        console.warn('Failed to create backup: ', error.message);
      }
    }
    
    const tempPath = CONFIG_PATH + '.tmp';
    config.touch();

    await fs.writeJSON(tempPath, config.toJSON(), { spaces: 2, mode: 0o600 });
    await fs.move(tempPath, CONFIG_PATH, { overwrite: true });
    await fs.chmod(CONFIG_PATH, 0o600);
    
    // Update cache
    configCache = config;
    cacheTimestamp = new Date();
    
  } catch (error: any) {
    if (error instanceof ConfigError) {
      throw error;
    }
    if (error.code === 'EACCES') {
      throw new ConfigError(ERROR_TYPE.ACCESS_DENIED);
    }
    if (error.code === 'ENOSPC') {
      throw new ConfigError(ERROR_TYPE.DISK_FULL);
    }

    throw new ConfigError(ERROR_TYPE.WRITE_ERROR);
  }
}

/**
 * Initialize configuration file if it doesn't exist
 * @throws {ConfigError} When initialization fails
 */
export async function initConfig(): Promise<boolean> {
  try {
    if (!await fs.pathExists(CONFIG_PATH)) {
      await saveConfig(DEFAULT_CONFIG);
      return true;
    }
    
    try {
      await loadConfig(true);
    } catch (error: any) {
      throw new ConfigError(ERROR_TYPE.VALIDATION_FAILED);
    }
    
    return false;
  } catch (error: any) {
    if (error instanceof BusinessError) {
      throw error;
    }
    if (error.code === 'EACCES') {
      throw new ConfigError(ERROR_TYPE.ACCESS_DENIED);
    }

    throw new ConfigError(ERROR_TYPE.INITIALIZATION_FAILED);
  }
}

/**
 * Get configuration file path
 */
export function getConfigPath(): string {
  return CONFIG_PATH;
}

/**
 * Get configuration backup file path
 */
export function getBackupPath(): string {
  return BACKUP_PATH;
}

/**
 * Restore configuration from backup
 * @throws {BusinessError} When restore operation fails
 */
export async function restoreFromBackup(): Promise<boolean> {
  try {
    if (!await fs.pathExists(BACKUP_PATH)) {
      return false;
    }
    
    const backupConfig = await fs.readJSON(BACKUP_PATH);
    Config.fromJSON(backupConfig);
    
    await fs.copy(BACKUP_PATH, CONFIG_PATH);
    
    // Clear cache to force reload
    configCache = null;
    cacheTimestamp = null;
    
    return true;
  } catch (error: any) {
    if (error instanceof ConfigError) {
      throw error;
    }
    throw new ConfigError(ERROR_TYPE.RESTORE_FAILED);
  }
}

/**
 * Clear configuration cache
 * Forces next loadConfig() call to read from disk
 */
export function clearCache(): void {
  configCache = null;
  cacheTimestamp = null;
}