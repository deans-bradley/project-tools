import { Base } from '../index.js';

/**
 * @typedef {Object} SettingsData
 * @property {string} defaultProjectsPath
 */

/**
 * Settings class for user settings and preferences
 */
class Settings extends Base {
  /**
   * Create a new Settings instance
   * @param {SettingsData} data - The Settings data
   */
  constructor(data = {}) {
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    this.defaultProjectsPath = data.defaultProjectsPath || "C:\\Users\\BradleyDeans\\Dev";
  }

  /**
   * Update the modified date timestamp
   */
  touch() {
    this.modifiedDate = new Date().toISOString();
  }

  /**
   * Update the default projects path
   * @param {string} newPath - New default projects path
   */
  setDefaultProjectsPath(newPath) {
    if (!newPath || typeof newPath !== 'string') {
      throw new Error('Default projects path must be a non-empty string');
    }
    this.defaultProjectsPath = newPath;
    this.touch();
  }

  /**
   * Validate the settings object
   * @throws {Error} When settings is invalid
   */
  validate() {
    if (!this.defaultProjectsPath || typeof this.defaultProjectsPath !== 'string') {
      throw new Error('defaultProjectsPath must be a non-empty string');
    }
    return true;
  }

  /**
   * Convert to plain JSON object for serialization
   * @returns {SettingsData} Plain object representation
   */
  toJSON() {
    return {
      defaultProjectsPath: this.defaultProjectsPath,
      modifiedDate: this.modifiedDate,
      createdDate: this.createdDate
    };
  }

  /**
   * Create a Settings instance from a plain object
   * @param {SettingsData} data - Plain object data
   * @returns {Settings} Settings instance
   */
  static fromJSON(data) {
    const settings = new Settings(data);
    settings.validate();
    return settings;
  }
}

export { Settings };