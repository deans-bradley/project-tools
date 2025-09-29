import { Base } from "./Base.js";

/**
 * Workspace class for development workspaces
 */
class Workspace extends Base {
  constructor(data = {}) {
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    
    this.id = data.id || this.generateId();
    this.name = data.name || "";
    this.description = data.description || "";
    this.path = data.path || "";
    this.isActive = data.isActive ?? false;
    this.projects = Array.isArray(data.projects) ? [...data.projects] : [];
    this.metadata = {
      vscodeSettings: data.metadata?.vscodeSettings || null,
      gitInfo: data.metadata?.gitInfo || null,
      lastAccessed: data.metadata?.lastAccessed || null,
      ...data.metadata
    };
  }

  /**
   * Generate a unique ID for the workspace
   * @returns {string} Generated ID
   */
  generateId() {
    return `ws_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Update the modified date timestamp
   */
  touch() {
    this.modifiedDate = new Date().toISOString();
  }

  /**
   * Add a project ID to this workspace
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
   * Remove a project ID from this workspace
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
   * Activate this workspace
   */
  activate() {
    this.isActive = true;
    this.metadata.lastAccessed = new Date().toISOString();
    this.touch();
  }

  /**
   * Deactivate this workspace
   */
  deactivate() {
    this.isActive = false;
    this.touch();
  }

  /**
   * Update workspace metadata
   * @param {Object} newMetadata - Metadata to update
   */
  updateMetadata(newMetadata) {
    this.metadata = { ...this.metadata, ...newMetadata };
    this.touch();
  }

  /**
   * Check if the workspace path exists
   * @returns {boolean} True if path exists
   */
  async exists() {
    try {
      const fs = await import('fs-extra');
      return await fs.pathExists(this.path);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate the workspace object
   * @throws {Error} When workspace is invalid
   */
  validate() {
    if (!this.id || typeof this.id !== 'string') {
      throw new Error('Workspace ID must be a non-empty string');
    }

    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Workspace name must be a non-empty string');
    }

    if (typeof this.description !== 'string') {
      throw new Error('Workspace description must be a string');
    }

    if (!this.path || typeof this.path !== 'string') {
      throw new Error('Workspace path must be a non-empty string');
    }

    if (typeof this.isActive !== 'boolean') {
      throw new Error('Workspace isActive must be a boolean');
    }

    if (!Array.isArray(this.projects)) {
      throw new Error('Workspace projects must be an array');
    }

    if (!this.metadata || typeof this.metadata !== 'object') {
      throw new Error('Workspace metadata must be an object');
    }

    return true;
  }

  /**
   * Convert to plain JSON object for serialization
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      path: this.path,
      isActive: this.isActive,
      projects: [...this.projects],
      metadata: { ...this.metadata },
      modifiedDate: this.modifiedDate,
      createdDate: this.createdDate
    };
  }

  /**
   * Create a Workspace instance from a plain object
   * @param {Object} data - Plain object data
   * @returns {Workspace} Workspace instance
   */
  static fromJSON(data) {
    const workspace = new Workspace(data);
    workspace.validate();
    return workspace;
  }
}

export { Workspace };