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

  /**
   * Adds a new project to the workspace
   * @param project
   */
  addProject(project: Project) {
    this.projects.push(project);
  }
}

export { Workspace };

