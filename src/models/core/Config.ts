import { version } from '../../../package.json';
import { ERROR_DOMAIN } from '../constants';
import { Base, Profile, Project, ResourceNotFoundError, Settings, Workspace } from '../index';
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

  /**
   * Returns the current active profile
   * @returns The active profile
   */
  getActiveProfile(): Profile {
    const activeProfile = this.profiles.find(p => p.isActive === true);

    if (!activeProfile) {
      throw new ResourceNotFoundError(ERROR_DOMAIN.PROFILE, "", "Could not find active profile");
    }

    return activeProfile;
  }

  /**
   * Sets the active profile
   * @param profileId
   * @returns 
   */
  setActiveProfile(profileId: string): void {
    const profile = this.profiles.find(p => p.id === profileId);

    if (!profile) {
      throw new ResourceNotFoundError(ERROR_DOMAIN.PROFILE, "", `Could not find profile with ID ${profileId}`);
    }

    profile.isActive = true;
  }

  static fromJSON(data: ConfigData): Config {
    const settings = new Settings(data.settings.defaultPath);
    const config = new Config(settings);
    
    config.profiles = (data.profiles || []).map((p: any) => {
      const workspaces = (p.workspaces || []).map((ws: any) => {
        const projects = (ws.projects || []).map((proj: any) => {
          const project = new Project(proj.name, proj.path, proj.tags || []);
          return project;
        });
        const workspace = new Workspace(ws.name, ws.path, projects);
        return workspace;
      });
      const profile = new Profile(p.name, p.isActive, workspaces);
      return profile;
    });
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

