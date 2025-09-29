import chalk from 'chalk';
import { generateId, cleanName } from '../utils/commonUtils.js';
import { loadConfig, saveConfig } from '../utils/configUtils.js';
import { Config, Profile } from '../models/index.js';

/**
 * ProfileManager - Handles all profile-related operations
 */
class ProfileManager {
  /**
   * Add a new profile
   * @param {string} profileName - Name of the profile to create
   * @returns {Object} Result object with success status and message
   */
  async addProfile(profileName) {
    try {
      if (!profileName || profileName.trim() === '') {
        return { success: false, message: 'Profile name cannot be empty' };
      }

      const cleanedName = cleanName(profileName);
      
      if (cleanedName !== profileName.trim().toLowerCase()) {
        console.log(chalk.yellow(`Profile name cleaned: "${profileName}" → "${cleanedName}"`));
      }

      const config = await loadConfig();
      const existingProfile = config.profiles.find(p => p.name === cleanedName);

      if (existingProfile) {
        return { success: false, message: `Profile "${cleanedName}" already exists` };
      }

      const newProfile = new Profile({
        id: generateId('prof'),
        name: cleanedName
      });

      config.addProfile(newProfile);
      const isFirstProfile = config.profiles.length === 1;

      if (isFirstProfile) {
        config.setActiveProfile(cleanedName);
      }

      await saveConfig(config);

      return { success: true, isFirstProfile };
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all profiles
   * @returns {Array<Profile>} Array of profile objects with active status
   */
  async listProfiles() {
    try {
      const config = await loadConfig();
      
      return config.profiles.map(profile => ({
        ...profile,
        active: profile.name === config.activeProfile
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Switch to a different profile
   * @param {string} profileName - Name of the profile to switch
   * @returns {Object} Result object with success status and message
   */
  async switchProfile(profileName) {
    try {
      if (!profileName || profileName.trim() === '') {
        return { success: false, message: 'Profile name cannot be empty' };
      }

      const cleanedName = cleanName(profileName);
      const config = await loadConfig();

      if (config.activeProfile === cleanedName) {
        return { success: false, message: `Already on profile "${cleanedName}"` };
      } else if (!config.profiles.find(profile => profile.name === cleanedName)) {
        return { success: false, message: `Profile "${cleanedName}" does not exist` };
      } else {
        config.setActiveProfile(cleanedName);
        await saveConfig(config);
        return { success: true, profileName: cleanedName };
      }
    } catch (error) {
      throw error;
    }
  }

  // TODO: The remove command should also remove all child workspaces and projects. (Will need to reconsider this)
  // For now the command will just remove the profile only.
  /**
   * Remove a specific profile
   * @param {string} profileName - Name of the profile to remove
   * @returns {Object} Result object with success status and message
   */
  async removeProfile(profileName) {
    try {
      if (!profileName || profileName.trim() === '') {
        return { success: false, message: 'Profile name cannot be empty' };
      }

      let activeProfile = null;
      const cleanedName = cleanName(profileName);
      const config = await loadConfig();

      if (!config.profiles.find(profile => profile.name === cleanedName)) {
        return { success: false, message: `Profile "${cleanedName}" does not exist` };
      } else {
        const activeProfileChanged = config.activeProfile === cleanedName;
        config.removeProfile(cleanedName);
        await saveConfig(config);

        return {
          success: true,
          removedProfile: cleanedName,
          activeProfileChanged: activeProfileChanged,
          activeProfile: config.activeProfile
        };
      }
    } catch (error) {
      throw error;
    }
  }
}

export default ProfileManager;