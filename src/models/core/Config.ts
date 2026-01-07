import { version } from '../../../package.json';
import { Base, Settings } from './index';

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
}

export { Config };

