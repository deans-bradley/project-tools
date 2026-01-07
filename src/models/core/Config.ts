import { version } from '../../../package.json';
import { Base, Settings } from './index';

interface ConfigData {
  appVersion?: string;
  settings: any;
  createdDate?: string;
  modifiedDate?: string;
}

/**
 * Config class for app configuration
 */
class Config extends Base {
  readonly appVersion: string;
  settings: Settings;

  constructor(settings: Settings) {
    super();
    this.appVersion = version;
    this.settings = settings;
  }

  static fromJSON(data: ConfigData): Config {
    const settings = new Settings(data.settings.defaultPath);
    const config = new Config(settings);
    
    if (data.createdDate) {
      (config as any).createdDate = new Date(data.createdDate);
    }
    if (data.modifiedDate) {
      config.modifiedDate = new Date(data.modifiedDate);
    }
    
    return config;
  }

  toJSON(): ConfigData {
    return {
      appVersion: this.appVersion,
      settings: {
        defaultPath: this.settings.defaultPath
      },
      createdDate: this.createdDate.toISOString(),
      modifiedDate: this.modifiedDate.toISOString()
    };
  }
}

export { Config };

