import { generateId } from '../../utils/commonUtils';
import { Base, Workspace } from '../index';

/**
 * Profile class for user profiles
 */
class Profile extends Base {
  readonly id: string;
  name: string;
  isActive: boolean;
  workspaces: Array<Workspace>;

  constructor(name: string, isActive?: boolean, workspaces?: Array<Workspace>) {
    super();
    this.id = generateId('prof');
    this.name = name;
    this.isActive = isActive || false;
    this.workspaces = workspaces || [];
  }
}

export { Profile };

