import { Base } from "./Base.js";

/**
 * Config class for app configuration
 */
class Config extends Base {
  constructor(data = {}) {
    // Initialize with current timestamps if not provided
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    
    this.appVersion = data.appVersion || "1.0.0";
    this.settings = {
      defaultProjectsPath: data.settings?.defaultProjectsPath || "C:\\Users\\BradleyDeans\\Dev",
      firstTimeSetup: data.settings?.firstTimeSetup ?? true
    };
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
   * @param {Object} profile - Profile object to add
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
      // Clear active profile if it was the one removed
      if (this.activeProfile === profileName) {
        this.activeProfile = null;
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
   * @returns {Object|null} Active profile or null if none set
   */
  getActiveProfile() {
    if (!this.activeProfile) return null;
    return this.profiles.find(p => p.name === this.activeProfile) || null;
  }

  /**
   * Add a workspace to the configuration
   * @param {Object} workspace - Workspace object to add
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
   * @param {Object} project - Project object to add
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
   * @param {Object} newSettings - Settings to update
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.touch();
  }

  /**
   * Mark first time setup as complete
   */
  completeFirstTimeSetup() {
    this.settings.firstTimeSetup = false;
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

    if (!this.settings || typeof this.settings !== 'object') {
      throw new Error('settings must be an object');
    }

    if (!this.settings.defaultProjectsPath || typeof this.settings.defaultProjectsPath !== 'string') {
      throw new Error('settings.defaultProjectsPath must be a non-empty string');
    }

    if (typeof this.settings.firstTimeSetup !== 'boolean') {
      throw new Error('settings.firstTimeSetup must be a boolean');
    }

    if (this.activeProfile !== null && typeof this.activeProfile !== 'string') {
      throw new Error('activeProfile must be a string or null');
    }

    if (!Array.isArray(this.profiles)) {
      throw new Error('profiles must be an array');
    }

    if (!Array.isArray(this.workspaces)) {
      throw new Error('workspaces must be an array');
    }

    if (!Array.isArray(this.projects)) {
      throw new Error('projects must be an array');
    }

    return true;
  }

  /**
   * Convert to plain JSON object for serialization
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      appVersion: this.appVersion,
      settings: { ...this.settings },
      activeProfile: this.activeProfile,
      profiles: [...this.profiles],
      workspaces: [...this.workspaces],
      projects: [...this.projects],
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