import { Base } from "./Base.js";

/**
 * Profile class for user profiles
 */
class Profile extends Base {
  constructor(data = {}) {
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    
    this.name = data.name || "";
    this.description = data.description || "";
    this.settings = {
      defaultProjectsPath: data.settings?.defaultProjectsPath || null,
      ...data.settings
    };
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
   * Add a workspace ID to this profile
   * @param {string} workspaceId - Workspace ID to add
   */
  addWorkspace(workspaceId) {
    if (!workspaceId || typeof workspaceId !== 'string') {
      throw new Error('Workspace ID must be a non-empty string');
    }
    if (!this.workspaces.includes(workspaceId)) {
      this.workspaces.push(workspaceId);
      this.touch();
    }
  }

  /**
   * Remove a workspace ID from this profile
   * @param {string} workspaceId - Workspace ID to remove
   */
  removeWorkspace(workspaceId) {
    const index = this.workspaces.indexOf(workspaceId);
    if (index !== -1) {
      this.workspaces.splice(index, 1);
      this.touch();
      return true;
    }
    return false;
  }

  /**
   * Add a project ID to this profile
   * @param {string} projectId - Project ID to add
   */
  addProject(projectId) {
    if (!projectId || typeof projectId !== 'string') {
      throw new Error('Project ID must be a non-empty string');
    }
    if (!this.projects.includes(projectId)) {
      this.projects.push(projectId);
      this.touch();
    }
  }

  /**
   * Remove a project ID from this profile
   * @param {string} projectId - Project ID to remove
   */
  removeProject(projectId) {
    const index = this.projects.indexOf(projectId);
    if (index !== -1) {
      this.projects.splice(index, 1);
      this.touch();
      return true;
    }
    return false;
  }

  /**
   * Update profile settings
   * @param {Object} newSettings - Settings to update
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.touch();
  }

  /**
   * Validate the profile object
   * @throws {Error} When profile is invalid
   */
  validate() {
    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Profile name must be a non-empty string');
    }

    if (typeof this.description !== 'string') {
      throw new Error('Profile description must be a string');
    }

    if (!this.settings || typeof this.settings !== 'object') {
      throw new Error('Profile settings must be an object');
    }

    if (!Array.isArray(this.workspaces)) {
      throw new Error('Profile workspaces must be an array');
    }

    if (!Array.isArray(this.projects)) {
      throw new Error('Profile projects must be an array');
    }

    return true;
  }

  /**
   * Convert to plain JSON object for serialization
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      name: this.name,
      description: this.description,
      settings: { ...this.settings },
      workspaces: [...this.workspaces],
      projects: [...this.projects],
      modifiedDate: this.modifiedDate,
      createdDate: this.createdDate
    };
  }

  /**
   * Create a Profile instance from a plain object
   * @param {Object} data - Plain object data
   * @returns {Profile} Profile instance
   */
  static fromJSON(data) {
    const profile = new Profile(data);
    profile.validate();
    return profile;
  }
}

export { Profile };