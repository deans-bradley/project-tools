import { Base } from "./Base.js";
import { generateId } from "../utils/commonUtils.js";

/**
 * Workspace class for development workspaces
 */
class Workspace extends Base {
  constructor(data = {}) {
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    
    this.id = data.id || this.generateId();
    this.name = data.name || "";
    this.path = data.path || "";
  }

  /**
   * Generate a unique ID for the workspace
   * @returns {string} Generated ID
   */
  generateId() {
    return generateId('ws');
  }

  /**
   * Update the modified date timestamp
   */
  touch() {
    this.modifiedDate = new Date().toISOString();
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

    if (!this.path || typeof this.path !== 'string') {
      throw new Error('Workspace path must be a non-empty string');
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