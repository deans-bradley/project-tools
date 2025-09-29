import { Base } from "./Base.js";
import { generateId } from "../utils/commonUtils.js";

/**
 * Project class for development projects
 */
class Project extends Base {
  constructor(data = {}) {
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    
    this.id = data.id || this.generateId();
    this.name = data.name || "";
    this.path = data.path || "";
    this.tags = data.tags || [];
    this.workspaceId = data.workspaceId || null;
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

    if (!this.path || typeof this.path !== 'string') {
      throw new Error('Project path must be a non-empty string');
    }

    if (this.workspaceId !== null && typeof this.workspaceId !== 'string') {
      throw new Error('Project workspaceId must be a string or null');
    }

    if (!Array.isArray(this.tags)) {
      throw new Error('Project tags must be an array');
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
      path: this.path,
      workspaceId: this.workspaceId,
      tags: [...this.tags],
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