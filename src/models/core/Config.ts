import { version } from '../../../package.json';
import { ERROR_DOMAIN } from '../constants';
import { Base, Profile, ResourceNotFoundError, Settings } from '../index';
import { ConfigData } from './interfaces/ConfigData';

/**
 * Config class for app configuration and data
 */
class Config extends Base {
  readonly appVersion: string;
  settings: Settings;
  profiles: Profile[];

  constructor(settings: Settings) {
    super();
    this.appVersion = version;
    this.settings = settings;
    this.profiles = [];
  }

  /**
   * Add a new profile to the app config
   * @param profile - The new profile to be added
   */
  addProfile(profile: Profile): void {
    this.profiles.push(profile);
  }
  
  /**
   * Remove a profile from the app config by the profile's ID
   * @param profileId - The profile ID of the profile to be removed
   */
  removeProfile(profileId: string): void {
    const profileIndex = this.profiles.findIndex(p => p.id === profileId);

    if (profileIndex === -1) {
      throw new ResourceNotFoundError(ERROR_DOMAIN.PROFILE, `profile with ID ${profileId}`);
    } else {
      this.profiles.splice(profileIndex);
    }
  }

  static fromJSON(data: ConfigData): Config {
    const settings = new Settings(data.settings.defaultPath);
    const config = new Config(settings);
    
    config.profiles = data.profiles;
    config.createdDate = data.createdDate;
    config.modifiedDate = data.modifiedDate;
    
    return config;
  }

  toJSON(): ConfigData {
    return {
      appVersion: this.appVersion,
      settings: {
        defaultPath: this.settings.defaultPath
      },
      profiles: this.profiles,
      createdDate: this.createdDate,
      modifiedDate: this.modifiedDate
    };
  }
}

export { Config };

