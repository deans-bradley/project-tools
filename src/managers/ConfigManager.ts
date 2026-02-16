import chalk from "chalk";
import fs from 'fs-extra';
import os from 'os';
import path from "path";
import { Config, ResourceNotFoundError, Settings } from "../models";
import { ERROR_DOMAIN, SETTINGS, SETTINGS_KEY } from "../models/constants";
import { getConfigPath, initConfig, loadConfig, saveConfig } from "../utils/configUtils";

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
   */
  async loadConfig(): Promise<Config> {
    try {
      return await loadConfig();
    } catch (error) {
      throw error;
    }
  }

    /**
   * Save configuration to file
   */
  async saveConfig(config: Config): Promise<void> {
    try {
      return await saveConfig(config);
    }
    catch (error) {
      throw error;
    }
  }

  /**
   * Get a configuration setting
   */
  async getSetting(key: string): Promise<any> {
    try {
      const config = await loadConfig();
      const prop = SETTINGS.get(key);
      if (!prop) {
        throw new ResourceNotFoundError(ERROR_DOMAIN.CONFIG, "", `Unknown setting key: ${key}`);
      }
      return config.settings?.[prop as keyof typeof config.settings];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set a configuration setting
   */
  async setSetting(key: string, value: any): Promise<void> {
    try {
      const config = await loadConfig();

      let settingValue = value;

      if (key === SETTINGS_KEY.DEFAULT_PATH) {
        settingValue = path.resolve(value);
        await fs.ensureDir(settingValue);
      }

      const prop = SETTINGS.get(key);

      if (!prop) {
        throw new ResourceNotFoundError(ERROR_DOMAIN.CONFIG, "", `Unknown setting key: ${key}`);
      }

      if (!config.settings) {
        config.settings = new Settings(path.join(os.homedir(), 'Dev'));
      }
      
      (config.settings as any)[prop] = settingValue;
      await saveConfig(config);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the default projects path
   */
  async getDefaultPath(): Promise<string> {
    try {
      const defaultPath = await this.getSetting(SETTINGS_KEY.DEFAULT_PATH);
      return defaultPath || path.join(os.homedir(), 'Dev');
    }
    catch (error) {
      throw error;
    }
  }

  /**
   * Set the default projects path
   */
  async setDefaultPath(projectsPath: string): Promise<void> {
    try {
      await fs.ensureDir(projectsPath);
      await this.setSetting(SETTINGS_KEY.DEFAULT_PATH, projectsPath);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get configuration file path (useful for debugging)
   */
  getConfigPath(): string {
    try {
      return getConfigPath();
    }
    catch (error) {
      throw error;
    }
  }
}

export { ConfigManager };

