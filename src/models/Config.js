import { Base } from "./Base.js";
import { ConfigError } from "./errors/ConfigError.js";
import { Profile } from "./Profile.js";
import { Project } from "./Project.js";
import { Settings } from "./Settings.js";
import { Workspace } from "./Workspace.js";

/**
 * Config class for app configuration
 */
class Config extends Base {
  constructor(data = {}) {
    // Initialize with current timestamps if not provided
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    
    this.appVersion = data.appVersion || "0.1.1";
    this.firstTimeSetup = data.firstTimeSetup ?? true;
    this.settings = new Settings(data.settings || {});
    this.activeProfile = data.activeProfile || null;
    this.profiles = Array.isArray(data.profiles) ? [...data.profiles] : [];
    this.workspaces = Array.isArray(data.workspaces) ? [...data.workspaces] : [];
    this.projects = Array.isArray(data.projects) ? [...data.projects] : [];
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
      if (this.activeProfile === profileName) {
        if (this.profiles.length > 0) {
          this.activeProfile = this.profiles[0].name;
        } else {
          this.activeProfile = null;
        }
      }
      this.touch();
      return true;
    }
    return false;
  }

  /**
   * Set the active profile
   * @param {string} profileName - Name of profile to set as active
   */
  setActiveProfile(profileName) {
    const profile = this.profiles.find(p => p.name === profileName);
    if (!profile) {
      throw new Error(`Profile '${profileName}' not found`);
    }
    this.activeProfile = profileName;
    this.touch();
  }

  /**
   * Get the active profile object
   * @returns {Profile|null} Active profile or null if none set
   */
  getActiveProfile() {
    if (!this.activeProfile) return null;
    return this.profiles.find(p => p.name === this.activeProfile) || null;
  }

  /**
   * Add a workspace to the configuration
   * @param {Workspace} workspace - Workspace object to add
   */
  addWorkspace(workspace) {
    if (!workspace || typeof workspace !== 'object') {
      throw new Error('Workspace must be an object');
    }
    this.workspaces.push(workspace);
    this.touch();
  }

  /**
   * Add a project to the configuration
   * @param {Project} project - Project object to add
   */
  addProject(project) {
    if (!project || typeof project !== 'object') {
      throw new Error('Project must be an object');
    }
    this.projects.push(project);
    this.touch();
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
   * @throws {ConfigError} When configuration is invalid
   */
  validate() {
    if (!this.appVersion || typeof this.appVersion !== 'string') {
      throw new ConfigError('appVersion must be a non-empty string', 'INVALID_TYPE');
    }

    if (typeof this.firstTimeSetup !== 'boolean') {
      throw new ConfigError('firstTimeSetup must be a boolean', 'INVALID_TYPE');
    }

    if (!this.settings || typeof this.settings !== 'object') {
      throw new ConfigError('settings must be an object', 'INVALID_TYPE');
    }

    // Validate the Settings instance
    try {
      this.settings.validate();
    } catch (error) {
      throw new ConfigError(`Invalid settings: ${error.message}`, 'INVALID_SETTINGS');
    }

    if (this.activeProfile !== null && typeof this.activeProfile !== 'string') {
      throw new ConfigError('activeProfile must be a string or null', 'INVALID_TYPE');
    }

    if (!Array.isArray(this.profiles)) {
      throw new ConfigError('profiles must be an array', 'INVALID_TYPE');
    }

    if (!Array.isArray(this.workspaces)) {
      throw new ConfigError('workspaces must be an array', 'INVALID_TYPE');
    }

    if (!Array.isArray(this.projects)) {
      throw new ConfigError('projects must be an array', 'INVALID_TYPE');
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
      activeProfile: this.activeProfile,
      profiles: this.profiles.map(p => p.toJSON ? p.toJSON() : p),
      workspaces: this.workspaces.map(w => w.toJSON ? w.toJSON() : w),
      projects: this.projects.map(p => p.toJSON ? p.toJSON() : p),
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