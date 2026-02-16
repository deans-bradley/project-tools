import chalk from 'chalk';
import { EmptyRequiredFieldError, Profile, ResourceAlreadyActiveError, ResourceAlreadyExistsError, ResourceNotFoundError } from '../models';
import { ERROR_DOMAIN } from '../models/constants';
import { cleanName } from '../utils/commonUtils';
import { loadConfig, saveConfig } from '../utils/configUtils';

/**
 * ProfileManager - Handles all profile-related operations
 */
export class ProfileManager {
  /**
   * Add a new profile
   * @param profileName - Name of the profile to create
   * @returns True if is first profile added, otherwise false
   */
  async addProfile(profileName: string): Promise<boolean> {
    try {
      if (!profileName || profileName.trim() === '') {
        throw new EmptyRequiredFieldError(ERROR_DOMAIN.PROFILE, "profile name");
      }

      const cleanedName = cleanName(profileName);
      
      if (cleanedName !== profileName.trim().toLowerCase()) {
        console.log(chalk.yellow(`Profile name cleaned: "${profileName}" → "${cleanedName}"`));
      }

      const config = await loadConfig();

      if (config.profiles.find(p => p.name === cleanedName)) {
        throw new ResourceAlreadyExistsError(ERROR_DOMAIN.PROFILE, cleanedName);
      }

      const isFirstProfile = config.profiles.length === 0;

      config.addProfile(new Profile(cleanedName, isFirstProfile));

      await saveConfig(config);
      return isFirstProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all profiles
   * @returns Array of profile objects with active status
   */
  async listProfiles(): Promise<Profile[]> {
    try {
      const config = await loadConfig();
      return config.profiles;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Switch to a different profile
   * @param profileName - Name of the profile to switch
   * @throws BusinessError
   */
  async switchProfile(profileName: string): Promise<void> {
    try {
      if (!profileName || profileName.trim() === '') {
        throw new EmptyRequiredFieldError(ERROR_DOMAIN.PROFILE, "profile name");
      }

      const cleanedName = cleanName(profileName);
      const config = await loadConfig();
      const activeProfile = config.getActiveProfile();
      const profile = config.profiles.find(profile => profile.name === cleanedName);

      if (activeProfile.name === cleanedName) {
        throw new ResourceAlreadyActiveError(ERROR_DOMAIN.PROFILE, cleanedName);
      } else if (!profile) {
        throw new ResourceNotFoundError(ERROR_DOMAIN.PROFILE, "", `Could not find profile "${cleanedName}"`);
      } else {
        config.setActiveProfile(profile.id);
        await saveConfig(config);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove a specific profile
   * @param profileName - Name of the profile to remove
   * @returns Result object with success status and message
   * @throws BusinessError
   */
  async removeProfile(profileName: string): Promise<{
    removedProfile: string;
    activeProfileChanged: boolean;
    activeProfile: string | null;
  }> {
    try {
      if (!profileName || profileName.trim() === '') {
        throw new EmptyRequiredFieldError(ERROR_DOMAIN.PROFILE, "profile name");
      }

      const cleanedName = cleanName(profileName);
      const config = await loadConfig();

      if (!config.profiles.find(profile => profile.name === cleanedName)) {
        throw new ResourceNotFoundError(ERROR_DOMAIN.PROFILE, "", `Could not find profile "${cleanedName}"`);
      } else {
        const activeProfile = config.getActiveProfile();
        const activeProfileChanged = activeProfile.name === cleanedName;
        config.removeProfile(cleanedName);
        await saveConfig(config);

        return {
          removedProfile: cleanedName,
          activeProfileChanged: activeProfileChanged,
          activeProfile: config.getActiveProfile().name
        };
      }
    } catch (error) {
      throw error;
    }
  }
}