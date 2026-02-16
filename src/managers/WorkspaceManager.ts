import chalk from 'chalk';
import fs from 'fs-extra';
import { EmptyRequiredFieldError, Profile, ResourceAlreadyExistsError, ResourceNotFoundError, Workspace } from '../models';
import { ERROR_DOMAIN } from '../models/constants';
import { cleanName } from '../utils/commonUtils';
import { loadConfig, saveConfig } from '../utils/configUtils';

interface AddWorkspaceOptions {
  path?: string;
  profile?: string;
}

interface ListWorkspaceOptions {
  all?: boolean;
}

interface RemoveWorkspaceOptions {
  profile?: string;
}

/**
 * WorkspaceManager - Handles all workspace-related operations
 */
export class WorkspaceManager {
  /**
   * Add a new workspace
   * @param workspaceName - Name of the workspace to create
   * @param options - Add workspace options
   * @returns The cleaned workspace name
   */
  async addWorkspace(workspaceName: string, options: AddWorkspaceOptions): Promise<string> {
    try {
      let workspacePath = options.path;
      const profileName = options.profile;
      let profile: Profile;

      if (!workspaceName || workspaceName.trim() === '') {
        throw new EmptyRequiredFieldError(ERROR_DOMAIN.WORKSPACE, "workspace name");
      }

      if (workspacePath && workspacePath.trim() === '') {
        throw new EmptyRequiredFieldError(ERROR_DOMAIN.WORKSPACE, "workspace path");
      }

      if (profileName && profileName.trim() === '') {
        throw new EmptyRequiredFieldError(ERROR_DOMAIN.WORKSPACE, "profile name");
      }

      const cleanedWorkspaceName = cleanName(workspaceName);
      
      if (cleanedWorkspaceName !== workspaceName.trim().toLowerCase()) {
        console.log(chalk.yellow(`Workspace name cleaned: "${workspaceName}" → "${cleanedWorkspaceName}"`));
      }

      const config = await loadConfig();

      if (profileName) {
        const foundProfile = config.profiles.find(p => p.name === cleanName(profileName));
        if (!foundProfile) {
          throw new ResourceNotFoundError(ERROR_DOMAIN.WORKSPACE, "", `Could not find profile "${profileName}"`);
        }
        profile = foundProfile;
      } else {
        profile = config.getActiveProfile();
      }

      if (profile.workspaces.find(ws => ws.name === cleanedWorkspaceName)) {
        throw new ResourceAlreadyExistsError(ERROR_DOMAIN.WORKSPACE, "", `Workspace "${cleanedWorkspaceName}" already exists`);
      }

      if (workspacePath) {
        await fs.ensureDir(workspacePath);
      } else {
        workspacePath = `${config.settings.defaultPath}/${profile.name}/${cleanedWorkspaceName}`;
        await fs.ensureDir(workspacePath);
      }

      const newWorkspace = new Workspace(cleanedWorkspaceName, workspacePath);
      
      profile.addWorkspace(newWorkspace);
      await saveConfig(config);

      return cleanedWorkspaceName;
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all workspaces
   * @param options - List workspace options
   * @returns Array of workspace objects or profiles
   */
  async listWorkspaces(options: ListWorkspaceOptions): Promise<Workspace[] | Profile[]> {
    try {
      const config = await loadConfig();
      if (options.all) {
        return config.profiles;
      }

      const profile = config.getActiveProfile();
      return profile.workspaces;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove a specific workspace from the active profile
   * @param workspaceName - Name of the workspace to remove
   * @param options - Remove workspace options
   * @returns The cleaned workspace name
   */
  async removeWorkspace(workspaceName: string, options: RemoveWorkspaceOptions): Promise<string> {
    try {
      const profileName = options.profile;
      let profile: Profile;

      if (!workspaceName || workspaceName.trim() === '') {
        throw new EmptyRequiredFieldError(ERROR_DOMAIN.WORKSPACE, "workspace name");
      }

      const cleanedWorkspaceName = cleanName(workspaceName);
      const config = await loadConfig();

      if (profileName) {
        const foundProfile = config.profiles.find(p => p.name === cleanName(profileName));
        if (!foundProfile) {
          throw new ResourceNotFoundError(ERROR_DOMAIN.WORKSPACE, "", `Could not find profile "${foundProfile}"`);
        }
        profile = foundProfile;
      } else {
        profile = config.getActiveProfile();
      }

      if (!profile.workspaces.find(workspace => workspace.name === cleanedWorkspaceName)) {
        throw new ResourceNotFoundError(ERROR_DOMAIN.WORKSPACE, "", `Could not find workspace "${cleanedWorkspaceName}"`);
      } else {
        profile.removeWorkspace(cleanedWorkspaceName);
        await saveConfig(config);
        return cleanedWorkspaceName;
      }
    } catch (error) {
      throw error;
    }
  }
}