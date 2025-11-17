import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { loadConfig, saveConfig, initConfig, getConfigPath } from '../utils/configUtils.js';

/**
 * ConfigManager - Handles all configuration-related operations
 */
class ConfigManager {
  constructor() {
    this.init();
  }
  /**
   * Initialize the application
   * Creates config directory and file if they don't exist
   */
  async init() {
    try {
      const wasCreated = await initConfig();
      
      if (wasCreated) {
        console.log(chalk.yellow('First time setup...'));
        console.log(chalk.green('Configuration initialized!'));
        console.log(chalk.blue(`Default projects path: ${path.join(os.homedir(), 'Dev')}`));
        console.log(chalk.gray('   You can change this later with: pt config set default-path <path>'));
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Load configuration from file
   * @returns {Config} Configuration object
   */
  async loadConfig() {
    try {
      return await loadConfig();
    }
    catch (error) {
      throw error;
    }
  }

  /**
   * Save configuration to file
   * @param {Config} config - Configuration object to save
   */
  async saveConfig(config) {
    try {
      return await saveConfig(config);
    }
    catch (error) {
      throw error;
    }
  }

  /**
   * Get a configuration setting
   * @param {string} key - Setting key (e.g., 'defaultProjectsPath')
   * @returns {any} Setting value
   */
  async getSetting(key) {
    try {
      const config = await loadConfig();
      return config.settings?.[key];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set a configuration setting
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   * @returns {Promise<void>}
   */
  async setSetting(key, value) {
    try {
      const config = await loadConfig();
      
      if (!config.settings) {
        config.settings = {};
      }
      
      config.settings[key] = value;
      await saveConfig(config);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the default projects path
   * @returns {string} Default projects path
   */
  async getDefaultProjectsPath() {
    try {
      const defaultPath = await this.getSetting('defaultProjectsPath');
      return defaultPath || path.join(os.homedir(), 'Dev');
    }
    catch (error) {
      throw error;
    }
  }

  /**
   * Set the default projects path
   * @param {string} projectsPath - New default projects path
   * @returns {Promise<void>} Result object with success status
   */
  async setDefaultProjectsPath(projectsPath) {
    try {
      // Resolve the path (handle ~ and relative paths)
      const resolvedPath = projectsPath.startsWith('~') 
        ? path.join(os.homedir(), projectsPath.slice(1))
        : path.resolve(projectsPath);

      await fs.ensureDir(resolvedPath);
      await this.setSetting('defaultProjectsPath', resolvedPath);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get configuration file path (useful for debugging)
   * @returns {string} Path to configuration file
   */
  getConfigPath() {
    try {
      return getConfigPath();
    }
    catch (error) {
      throw error;
    }
  }
}

export default ConfigManager;