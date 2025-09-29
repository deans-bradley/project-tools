import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { createFolder } from './pathUtils.js';

// Configuration file path - shared across the application
export const CONFIG_PATH = path.join(os.homedir(), '.projecttools', 'config.json');

// Default configuration structure
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
 * Load configuration from file
 * @returns {Object} Configuration object
 */
export async function loadConfig() {
  try {
    const config = await fs.readJSON(CONFIG_PATH);
    return config;
  } catch (error) {
    throw error;
  }
}

/**
 * Save configuration to file
 * @param {Object} config - Configuration object to save
 */
export async function saveConfig(config) {
  try {
    await fs.ensureDir(path.dirname(CONFIG_PATH));
    await fs.writeJSON(CONFIG_PATH, config, { spaces: 2 });
  } catch (error) {
    throw error;
  }
}

/**
 * Initialize configuration file if it doesn't exist
 * @returns {boolean} True if config was created, false if it already existed
 */
export async function initConfig() {
  try {
    await fs.ensureDir(path.dirname(CONFIG_PATH));
    
    if (!await fs.pathExists(CONFIG_PATH)) {
      await createFolder(DEFAULT_CONFIG.settings.defaultProjectsPath);
      await saveConfig(DEFAULT_CONFIG);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Get configuration file path
 * @returns {string} Path to configuration file
 */
export function getConfigPath() {
  return CONFIG_PATH;
}