import { Base } from "./Base.js";

/**
 * Project class for development projects
 */
class Project extends Base {
  constructor(data = {}) {
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    
    this.id = data.id || this.generateId();
    this.name = data.name || "";
    this.description = data.description || "";
    this.path = data.path || "";
    this.type = data.type || "general"; // e.g., "nodejs", "python", "react", "general"
    this.status = data.status || "active"; // e.g., "active", "archived", "paused"
    this.workspaceId = data.workspaceId || null;
    this.tags = Array.isArray(data.tags) ? [...data.tags] : [];
    this.metadata = {
      gitRemote: data.metadata?.gitRemote || null,
      packageManager: data.metadata?.packageManager || null, // npm, yarn, pnpm, etc.
      framework: data.metadata?.framework || null,
      language: data.metadata?.language || null,
      lastAccessed: data.metadata?.lastAccessed || null,
      ...data.metadata
    };
  }

  /**
   * Generate a unique ID for the project
   * @returns {string} Generated ID
   */
  generateId() {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update the modified date timestamp
   */
  touch() {
    this.modifiedDate = new Date().toISOString();
  }

  /**
   * Add a tag to this project
   * @param {string} tag - Tag to add
   */
  addTag(tag) {
    if (!tag || typeof tag !== 'string') {
      throw new Error('Tag must be a non-empty string');
    }
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.touch();
    }
  }

  /**
   * Remove a tag from this project
   * @param {string} tag - Tag to remove
   */
  removeTag(tag) {
    const index = this.tags.indexOf(tag);
    if (index !== -1) {
      this.tags.splice(index, 1);
      this.touch();
      return true;
    }
    return false;
  }

  /**
   * Set the project status
   * @param {string} status - New status ("active", "archived", "paused")
   */
  setStatus(status) {
    const validStatuses = ["active", "archived", "paused"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
    }
    this.status = status;
    this.touch();
  }

  /**
   * Archive the project
   */
  archive() {
    this.setStatus("archived");
  }

  /**
   * Activate the project
   */
  activate() {
    this.setStatus("active");
    this.metadata.lastAccessed = new Date().toISOString();
    this.touch();
  }

  /**
   * Pause the project
   */
  pause() {
    this.setStatus("paused");
  }

  /**
   * Update project metadata
   * @param {Object} newMetadata - Metadata to update
   */
  updateMetadata(newMetadata) {
    this.metadata = { ...this.metadata, ...newMetadata };
    this.touch();
  }

  /**
   * Check if the project path exists
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
   * Check if this is an active project
   * @returns {boolean} True if project is active
   */
  isActive() {
    return this.status === "active";
  }

  /**
   * Check if this is an archived project
   * @returns {boolean} True if project is archived
   */
  isArchived() {
    return this.status === "archived";
  }

  /**
   * Check if this is a paused project
   * @returns {boolean} True if project is paused
   */
  isPaused() {
    return this.status === "paused";
  }

  /**
   * Validate the project object
   * @throws {Error} When project is invalid
   */
  validate() {
    if (!this.id || typeof this.id !== 'string') {
      throw new Error('Project ID must be a non-empty string');
    }

    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Project name must be a non-empty string');
    }

    if (typeof this.description !== 'string') {
      throw new Error('Project description must be a string');
    }

    if (!this.path || typeof this.path !== 'string') {
      throw new Error('Project path must be a non-empty string');
    }

    if (!this.type || typeof this.type !== 'string') {
      throw new Error('Project type must be a non-empty string');
    }

    const validStatuses = ["active", "archived", "paused"];
    if (!validStatuses.includes(this.status)) {
      throw new Error(`Project status must be one of: ${validStatuses.join(', ')}`);
    }

    if (this.workspaceId !== null && typeof this.workspaceId !== 'string') {
      throw new Error('Project workspaceId must be a string or null');
    }

    if (!Array.isArray(this.tags)) {
      throw new Error('Project tags must be an array');
    }

    if (!this.metadata || typeof this.metadata !== 'object') {
      throw new Error('Project metadata must be an object');
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
      type: this.type,
      status: this.status,
      workspaceId: this.workspaceId,
      tags: [...this.tags],
      metadata: { ...this.metadata },
      modifiedDate: this.modifiedDate,
      createdDate: this.createdDate
    };
  }

  /**
   * Create a Project instance from a plain object
   * @param {Object} data - Plain object data
   * @returns {Project} Project instance
   */
  static fromJSON(data) {
    const project = new Project(data);
    project.validate();
    return project;
  }
}

export { Project };