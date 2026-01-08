import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { ERROR_DOMAIN } from '../models/constants/index';
import { AccessToResourceDeniedError, BusinessError, Config, DiskFullError, InitializationFailedError, InvalidJsonError, InvalidValueError, ResourceNotFoundError, RestoreFailedError, Settings, WriteError } from '../models/index';

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
    if (error.code === 'ENOENT') {
      throw new ResourceNotFoundError(ERROR_DOMAIN.CONFIG, 'configuration file');
    }
    if (error.code === 'EACCES') {
      throw new AccessToResourceDeniedError(ERROR_DOMAIN.CONFIG, 'configuration file');
    }
    if (error.name === 'SyntaxError') {
      throw new InvalidJsonError(ERROR_DOMAIN.CONFIG, 'configuration');
    }

    throw error;
  }
}

/**
 * Save configuration to file with backup and atomic writes
 * @throws {BusinessError} When configuration cannot be saved
 */
export async function saveConfig(config: Config): Promise<void> {
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
    if (error.code === 'EACCES') {
      throw new AccessToResourceDeniedError(ERROR_DOMAIN.CONFIG, 'configuration file');
    }
    if (error.code === 'ENOSPC') {
      throw new DiskFullError(ERROR_DOMAIN.CONFIG, 'configuration');
    }

    throw new WriteError(ERROR_DOMAIN.CONFIG, 'configuration');
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
      throw new InvalidValueError(ERROR_DOMAIN.CONFIG, 'configuration', 'configuration file');
    }
    
    return false;
  } catch (error: any) {
    if (error instanceof BusinessError) {
      throw error;
    }
    if (error.code === 'EACCES') {
      throw new AccessToResourceDeniedError(ERROR_DOMAIN.CONFIG, 'configuration file');
    }

    throw new InitializationFailedError(ERROR_DOMAIN.CONFIG, 'configuration');
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
    throw new RestoreFailedError(ERROR_DOMAIN.CONFIG, 'configuration');
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