import chalk from "chalk";
import fs from 'fs-extra';
import os from 'os';
import path from "path";
import { Config, Settings } from "../models";
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
      return config.settings?.[key as keyof typeof config.settings];
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
      
      if (!config.settings) {
        config.settings = new Settings(path.join(os.homedir(), 'Dev'));
      }
      
      (config.settings as any)[key] = value;
      await saveConfig(config);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the default projects path
   */
  async getDefaultProjectsPath(): Promise<string> {
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
   */
  async setDefaultProjectsPath(projectsPath: string): Promise<void> {
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

