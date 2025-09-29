import { Base } from "./Base.js";
import { generateId } from "../utils/commonUtils.js";

/**
 * Profile class for user profiles
 */
class Profile extends Base {
  constructor(data = {}) {
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    
    this.id = data.id;
    this.name = data.name;
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