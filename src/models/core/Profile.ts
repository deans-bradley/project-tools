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

  /**
   * Adds a new workspace to the active profile
   * @param workspace
   */
  addWorkspace(workspace: Workspace) {
    this.workspaces.push(workspace);
  }

  /**
   * Removes a workspace from the active profile
   * @param workspaceName
   */
  removeWorkspace(workspaceName: string) {
    this.workspaces = this.workspaces.filter(w => w.name !== workspaceName);
  }
}

export { Profile };

