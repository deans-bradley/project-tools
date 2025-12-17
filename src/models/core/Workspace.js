import { Base, Project } from '../index.js';
import { generateId } from '../../utils/commonUtils.js';
import fs from 'fs-extra';

/**
 * @typedef {Object} WorkspaceData
 * @property {string} id
 * @property {string} name
 * @property {string} path
 * @property {Array<Project>} projects
 */

/**
 * Workspace class for development workspaces
 */
class Workspace extends Base {
  /**
   * Create a new Workspace instance
   * @param {WorkspaceData} data - The Workspace data
   */
  constructor(data = {}) {
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    
    this.id = data.id || generateId('ws');
    this.name = data.name;
    this.path = data.path;
    this.projects = data.projects ? Project.fromJSONArray(data.projects) : [];
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
      profile: this.profile,
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

  /**
   * Creates an array of Profile instances from an array of plain objects
   * @param {ProfileData[]} data - Array of plain objects
   * @returns {Profile[]} Array of Profile instances
   */
  static fromJSONArray(data) {
    const workspaces = [];

    data.forEach(workspace => {
      workspaces.push(Workspace.fromJSON(workspace));
    });

    return workspaces;
  }
}

export { Workspace };