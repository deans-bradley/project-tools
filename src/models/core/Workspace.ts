import { generateId } from '../../utils/commonUtils';
import { Base, Project } from '../index';

/**
 * Workspace class for development workspaces
 */
class Workspace extends Base {
  readonly id: string;
  name: string;
  path: string;
  projects: Array<Project>;

  constructor(name: string, path: string, projects?: Array<Project>) {
    super();
    this.id = generateId('ws');
    this.name = name;
    this.path = path;
    this.projects = projects || [];
  }
}

export { Workspace };

