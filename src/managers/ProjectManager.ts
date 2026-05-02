import chalk from "chalk";
import fs from 'fs-extra';
import { EmptyRequiredFieldError, Profile, Project, ResourceNotFoundError, Workspace } from "../models";
import { ERROR_DOMAIN } from "../models/constants";
import { cleanName } from "../utils/commonUtils";
import { loadConfig, saveConfig } from "../utils/configUtils";

interface AddProjectOptions {
  path?: string;
  profile?: string;
}

// interface ListProjectOptions {
//   all?: boolean;
// }

// interface RemoveProjectOptions {
//   profile?: string;
// }

/**
 * ProjectManager - Handles all project-related operations
 */
export class ProjectManager {
  /**
   * Add a new project
   * @param projectName - Name of the project to create
   * @param options - Add project options
   * @returns The cleaned project name
   */
  async addProject(projectName: string, workspaceName: string, options: AddProjectOptions) {
    try {
      let projectPath = options.path;
      const profileName = options.profile;
      let workspace: Workspace;
      let profile: Profile;

      if (!projectName || projectName.trim() === '') {
        throw new EmptyRequiredFieldError(ERROR_DOMAIN.PROJECT, "project name");
      }

      if (projectPath && projectPath.trim() === '') {
        throw new EmptyRequiredFieldError(ERROR_DOMAIN.PROJECT, "project path");
      }

      if (workspaceName && workspaceName.trim() === '') {
        throw new EmptyRequiredFieldError(ERROR_DOMAIN.PROJECT, "workspace name");
      }

      if (profileName && profileName.trim() === '') {
        throw new EmptyRequiredFieldError(ERROR_DOMAIN.PROJECT, "profile name");
      }

      const cleanedPorjectName = cleanName(projectName);
      
      if (cleanedPorjectName !== projectName.trim().toLowerCase()) {
        console.log(chalk.yellow(`Project name cleaned: "${projectName}" → "${cleanedPorjectName}"`));
      }

      const config = await loadConfig();

      if (profileName) {
        const foundProfile = config.profiles.find(p => p.name === cleanName(profileName));
        if (!foundProfile) {
          throw new ResourceNotFoundError(ERROR_DOMAIN.PROJECT, "", `Could not find profile "${profileName}"`);
        }
        profile = foundProfile;
      } else {
        profile = config.getActiveProfile();
      }

      const foundWorkspace = profile.workspaces.find(w => w.name === cleanName(workspaceName));
      if (!foundWorkspace) {
        throw new ResourceNotFoundError(ERROR_DOMAIN.PROJECT, "", `Could not find workspace "${workspaceName}"`);
      }
      workspace = foundWorkspace;

      if (projectPath) {
        await fs.ensureDir(projectPath);
      } else {
        projectPath = `${config.settings.defaultPath}/${profile.name}/${workspace.name}/${cleanedPorjectName}`;
        await fs.ensureDir(projectPath);
      }

      workspace.addProject(new Project(cleanedPorjectName, projectPath, []));
      await saveConfig(config);

      return cleanedPorjectName;
    } catch (error) {
      throw error;
    }
  }
}