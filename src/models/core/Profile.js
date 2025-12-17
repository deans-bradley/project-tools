import { Base, BusinessError, Workspace } from '../index.js';
import { generateId } from '../../utils/commonUtils.js';
import { WORKSPACE_ERROR } from '../constants/index.js';

/**
 * @typedef {Object} ProfileData
 * @property {string} id
 * @property {string} name
 * @property {boolean} isActive
 * @property {Array<Workspace>} workspaces
 */

/**
 * Profile class for user profiles
 */
class Profile extends Base {
  /**
   * Create a new Profile instance
   * @param {ProfileData} data - The Profile data
   */
  constructor(data = {}) {
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    
    /** @type {string} */
    this.id = data.id || generateId('prof');
    /** @type {string} */
    this.name = data.name;
    /** @type {boolean} */
    this.isActive = data.isActive || false;
    /** @type {Array<Workspace>} */
    this.workspaces = data.workspaces ? Workspace.fromJSONArray(data.workspaces) : [];
  }

  /**
   * Update the modified date timestamp
   */
  touch() {
    this.modifiedDate = new Date().toISOString();
  }

  /**
   * Validate the profile object
   * @throws {Error} When profile is invalid
   */
  validate() {
    if (!this.id || typeof this.id !== 'string') {
      throw new Error('Profile ID must be a non-empty string');
    }

    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Profile name must be a non-empty string');
    }

    if (this.isActive === null || typeof this.isActive !== 'boolean') {
      throw new Error('Profile isActive flag must be a non-empty boolean');
    }

    return true;
  }

  /**
   * Add a workspace to the current profile
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
   * Remove a workspace from the current profile by the workspace name
   * @param {string} workspaceName - The name of the workspace to be removed
   */
  removeWorkspace(workspaceName) {
    const index = this.workspaces.findIndex(ws => ws.name === workspaceName);
    if (index === -1) {
      throw new BusinessError(WORKSPACE_ERROR.NOT_FOUND);
    }
    this.workspaces.splice(index, 1);
    this.touch();
  }
 
  /**
   * Convert to plain JSON object for serialization
   * @returns {ProfileData} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      isActive: this.isActive,
      workspaces: this.workspaces,
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

  /**
   * Creates an array of Profile instances from an array of plain objects
   * @param {ProfileData[]} data - Array of plain objects
   * @returns {Profile[]} Array of Profile instances
   */
  static fromJSONArray(data) {
    const profiles = [];

    data.forEach(profile => {
      profiles.push(Profile.fromJSON(profile));
    });

    return profiles;
  }
}

export { Profile };