import { Base, Profile, Settings } from '../index.js';

/**
 * @typedef {Object} ConfigData
 * @property {string} appVersion
 * @property {boolean} firstTimeSetup
 * @property {Settings} settings
 * @property {Array<Profile>} profiles
 */

/**
 * Config class for app configuration
 */
class Config extends Base {
  /**
   * Create a new Config instance
   * @param {ConfigData} data - The Config data
   */
  constructor(data = {}) {
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    
    this.appVersion = data.appVersion || "0.1.1";
    this.firstTimeSetup = data.firstTimeSetup ?? true;
    this.settings = new Settings(data.settings || {});
    this.profiles = data.profiles ? Profile.fromJSONArray(data.profiles) : [];
  }

  /**
   * Update the modified date timestamp
   */
  touch() {
    this.modifiedDate = new Date().toISOString();
  }

  /**
   * Add a profile to the configuration
   * @param {Profile} profile - Profile object to add
   */
  addProfile(profile) {
    if (!profile || typeof profile !== 'object') {
      throw new Error('Profile must be an object');
    }
    this.profiles.push(profile);
    this.touch();
  }

  /**
   * Remove a profile by name
   * @param {string} profileName - Name of profile to remove
   */
  removeProfile(profileName) {
    const index = this.profiles.findIndex(p => p.name === profileName);
    if (index !== -1) {
      this.profiles.splice(index, 1);
      // Update active profile if it was the one removed
      const profile = this.profiles.find(p => p.isActive);
      if (!profile && this.profiles.length > 0) {
        const newActiveProfile = this.profiles[0];
        newActiveProfile.isActive = true;
        newActiveProfile.touch();
      }
      this.touch();
    }
  }

  /**
   * Set the active profile
   * @param {string} profileName - Name of profile to set as active
   */
  setActiveProfile(profileName) {
    const profile = this.profiles.find(p => p.name === profileName);

    if (!profile)
      throw new Error(`Profile '${profileName}' not found`);
    
    const activeProfile = this.getActiveProfile();
    activeProfile.isActive = false;
    activeProfile.touch();

    profile.isActive = true;
    profile.touch();
    this.touch();
  }

  /**
   * Get the active profile object
   * @returns {Profile|null} Active profile or null if none set
   */
  getActiveProfile() {
    const activeProfile = this.profiles.find(p => p.isActive);
    if (!activeProfile) return null;
    return activeProfile;
  }

  /**
   * Update settings
   * @param {Settings} newSettings - Settings to update
   */
  updateSettings(newSettings) {
    // Update the existing Settings instance
    Object.assign(this.settings, newSettings);
    this.settings.touch();
    this.touch();
  }

  /**
   * Mark first time setup as complete
   */
  completeFirstTimeSetup() {
    this.firstTimeSetup = false;
    this.touch();
  }

  /**
   * Validate the configuration object
   * @throws {Error} When configuration is invalid
   */
  validate() {
    if (!this.appVersion || typeof this.appVersion !== 'string') {
      throw new Error('appVersion must be a non-empty string');
    }

    if (typeof this.firstTimeSetup !== 'boolean') {
      throw new Error('firstTimeSetup must be a boolean');
    }

    if (!this.settings || typeof this.settings !== 'object') {
      throw new Error('settings must be an object');
    }

    // Validate the Settings instance
    try {
      this.settings.validate();
    } catch (error) {
      throw new Error(`Invalid settings: ${error.message}`);
    }

    if (!Array.isArray(this.profiles)) {
      throw new Error('profiles must be an array');
    }
  }

  /**
   * Convert to plain JSON object for serialization
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      appVersion: this.appVersion,
      firstTimeSetup: this.firstTimeSetup,
      settings: this.settings.toJSON ? this.settings.toJSON() : this.settings,
      profiles: this.profiles.map(p => p.toJSON ? p.toJSON() : p),
      modifiedDate: this.modifiedDate,
      createdDate: this.createdDate
    };
  }

  /**
   * Create a Config instance from a plain object
   * @param {Object} data - Plain object data
   * @returns {Config} Config instance
   */
  static fromJSON(data) {
    const config = new Config(data);
    config.validate();
    return config;
  }
}

export { Config };