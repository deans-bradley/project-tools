import chalk from 'chalk';
import { cleanName } from '../utils/commonUtils.js';
import { loadConfig, saveConfig } from '../utils/configUtils.js';
import { Profile, BusinessError } from '../models/index.js';
import { PROFILE_ERROR } from '../models/constants/index.js';

/**
 * ProfileManager - Handles all profile-related operations
 */
class ProfileManager {
  /**
   * Add a new profile
   * @param {string} profileName - Name of the profile to create
   * @returns {boolean} True if is first profile added, otherwise false
   * @throws {BusinessError}
   */
  async addProfile(profileName) {
    try {
      if (!profileName || profileName.trim() === '')
        throw new BusinessError(PROFILE_ERROR.PROFILE_EMPTY_NAME);

      const cleanedName = cleanName(profileName);
      
      if (cleanedName !== profileName.trim().toLowerCase())
        console.log(chalk.yellow(`Profile name cleaned: "${profileName}" → "${cleanedName}"`));

      const config = await loadConfig();

      if (config.profiles.find(p => p.name === cleanedName))
        throw new BusinessError(PROFILE_ERROR.PROFILE_ALREADY_EXISTS);

      const isFirstProfile = config.profiles.length === 0;

      config.addProfile(
        new Profile({
          name: cleanedName,
          isActive: isFirstProfile
        })
      );

      await saveConfig(config);
      return isFirstProfile;
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
      return config.profiles;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Switch to a different profile
   * @param {string} profileName - Name of the profile to switch
   * @throws {BusinessError}
   */
  async switchProfile(profileName) {
    try {
      if (!profileName || profileName.trim() === '')
        throw new BusinessError(PROFILE_ERROR.PROFILE_EMPTY_NAME);

      const cleanedName = cleanName(profileName);
      const config = await loadConfig();
      const activeProfile = config.getActiveProfile();

      if (activeProfile.name === cleanedName) {
        throw new BusinessError(PROFILE_ERROR.PROFILE_ALREADY_ACTIVE);
      } else if (!config.profiles.find(profile => profile.name === cleanedName)) {
        throw new BusinessError(PROFILE_ERROR.PROFILE_NOT_FOUND);
      } else {
        config.setActiveProfile(cleanedName);
        await saveConfig(config);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove a specific profile
   * @param {string} profileName - Name of the profile to remove
   * @returns {{removeProfile: string, activeProfileChanged: boolean, activeProfile: string}} Result object with success status and message
   * @throws {BusinessError}
   */
  async removeProfile(profileName) {
    try {
      if (!profileName || profileName.trim() === '')
        throw new BusinessError(PROFILE_ERROR.PROFILE_EMPTY_NAME);

      const cleanedName = cleanName(profileName);
      const config = await loadConfig();

      if (!config.profiles.find(profile => profile.name === cleanedName)) {
        throw new BusinessError(PROFILE_ERROR.PROFILE_NOT_FOUND);
      } else {
        const activeProfileChanged = config.activeProfile === cleanedName;
        config.removeProfile(cleanedName);
        await saveConfig(config);

        return {
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