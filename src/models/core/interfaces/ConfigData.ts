import { SettingsData } from './SettingsData';

interface ConfigData {
  appVersion: string;
  settings: SettingsData;
  profiles: Array<any>;
  createdDate: Date;
  modifiedDate: Date;
}

export { ConfigData };

