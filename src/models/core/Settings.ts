import fs from 'fs-extra';
import { Base } from '../index';

/**
 * Settings class for user settings and preferences
 */
class Settings extends Base {
  defaultPath: string;

  constructor(defaultPath: string) {
    super();
    this.defaultPath = defaultPath;
  }

  async setDefaultPath(path: string): Promise<void> {
    try {
      await fs.ensureDir(path);
    } catch (error) {
      throw error; // TODO: Throw custom Error
    }
    this.defaultPath = path;
    this.touch();
  }
}

export { Settings };

