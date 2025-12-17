import chalk from 'chalk';
import fs from 'fs-extra';
import { loadConfig, saveConfig } from '../utils/configUtils.js';
import { cleanName } from '../utils/commonUtils.js';
import { Workspace, BusinessError } from '../models/index.js';
import { WORKSPACE_ERROR } from '../models/constants/errors/workspaceError.js';
import { PROFILE_ERROR } from '../models/constants/index.js';

/**
 * WorkspaceManager - Handles all workspace-related operations
 */
class WorkspaceManager {
  /**
   * Add a new workspace
   * @param {string} workspaceName - Name of the workspace to create
   * @param {{path: string|undefined, profile: string|undefined}} options - Add workspace options
   * @returns {string} The cleaned workspace name
   */
  async addWorkspace(workspaceName, options) {
    try {
      let workspacePath = options.path;
      const profileName = options.profile;
      let profile;

      if (!workspaceName || workspaceName.trim() === '')
        throw new BusinessError(WORKSPACE_ERROR.EMPTY_NAME);

      if (workspacePath && workspacePath.trim() === '')
        throw new BusinessError(WORKSPACE_ERROR.EMPTY_PATH);

      if (profileName && profileName.trim() === '')
        throw new BusinessError(WORKSPACE_ERROR.EMPTY_PROFILE_NAME);

      const cleanedWorkspaceName = cleanName(workspaceName);
      
      if (cleanedWorkspaceName !== workspaceName.trim().toLowerCase())
        console.log(chalk.yellow(`Workspace name cleaned: "${workspaceName}" → "${cleanedWorkspaceName}"`));

      const config = await loadConfig();

      if (profileName) {
        profile = config.profiles.find(p => p.name === cleanName(profileName));
        if (!profile) {
          throw new BusinessError(PROFILE_ERROR.PROFILE_NOT_FOUND);
        }
      } else {
        profile = config.getActiveProfile();
      }

      if (profile.workspaces.find(ws => ws.name === cleanedWorkspaceName))
        throw new BusinessError(WORKSPACE_ERROR.ALREADY_EXISTS);

      if (workspacePath) {
        await fs.ensureDir(workspacePath);
      } else {
        workspacePath = `${config.settings.defaultProjectsPath}/${profile.name}/${cleanedWorkspaceName}`
        await fs.ensureDir(workspacePath);
      }

      const newWorkspace = new Workspace({
        name: cleanedWorkspaceName,
        path: workspacePath
      });
      
      profile.addWorkspace(newWorkspace);
      await saveConfig(config);

      return cleanedWorkspaceName;
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all workspaces
   * @param {{all: boolean|undefined}} options - List workspace options
   * @returns {Array<Workspace|Profile>} Array of workspace objects
   */
  async listWorkspaces(options) {
    try {
      const config = await loadConfig();
      if (options.all) return config.profiles.flat();

      const profile = config.getActiveProfile();
      return profile.workspaces;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove a specific workspace from the active profile
   * @param {string} workspaceName - Name of the workspace to remove
   * @param {{profile: string|undefined}} options - Remove workspace options
   * @returns {string} The cleaned workspace name
   */
  async removeWorkspace(workspaceName, options) {
    try {
      const profileName = options.profile;
      let profile;

      if (!workspaceName || workspaceName.trim() === '') 
        throw new BusinessError(WORKSPACE_ERROR.EMPTY_NAME);

      const cleanedWorkspaceName = cleanName(workspaceName);
      const config = await loadConfig();

      if (profileName) {
        profile = config.profiles.find(p => p.name === cleanName(profileName));
        if (!profile) {
          throw new BusinessError(PROFILE_ERROR.PROFILE_NOT_FOUND);
        }
      } else {
        profile = config.getActiveProfile();
      }

      if (!profile.workspaces.find(workspace => workspace.name === cleanedWorkspaceName)) {
        throw new BusinessError(WORKSPACE_ERROR.NOT_FOUND);
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

export default WorkspaceManager;