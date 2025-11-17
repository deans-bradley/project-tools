import chalk from 'chalk';
import fs from 'fs-extra';
import { loadConfig, saveConfig } from '../utils/configUtils.js';
import { cleanName } from '../utils/commonUtils.js';
import { Workspace } from '../models/index.js';

/**
 * WorkspaceManager - Handles all workspace-related operations
 */
class WorkspaceManager {
  /**
   * Add a new workspace
   * @param {string} workspaceName - Name of the workspace to create
   * @returns {Object} Result object with success status and message
   */
  async addWorkspace(workspaceName, options) {
    try {
      let workspacePath = options.path;
      let profileName = options.profile;

      if (!workspaceName || workspaceName.trim() === '')
        return { success: false, message: 'Workspace name cannot be empty' };

      if (workspacePath && workspacePath.trim() === '')
        return { success: false, message: 'Path cannot be empty' };

      if (profileName && profileName.trim() === '')
        return { success: false, message: 'Profile cannot be empty' };

      const cleanedWorkspaceName = cleanName(workspaceName);
      
      if (cleanedWorkspaceName !== workspaceName.trim().toLowerCase())
        console.log(chalk.yellow(`Workspace name cleaned: "${workspaceName}" → "${cleanedWorkspaceName}"`));

      const config = await loadConfig();

      if (config.workspaces.find(ws => ws.name === cleanedWorkspaceName))
        return { success: false, message: `Workspace "${cleanedWorkspaceName}" already exists` };

      let profile;

      if (profileName) {
        profile = config.profiles.find(p => p.name === cleanName(profileName));

        if (!profile) {
          return { success: false, message: `Profile "${profileName}" does not exist. Add a new profile with: pt profile add <profile>` };
        }
      }

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
      
      config.addWorkspace(newWorkspace, profile);
      await saveConfig(config);

      return { 
        success: true,
        workspaceName: cleanedWorkspaceName
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all workspaces
   * @param {boolean} showAll - Option to show all workspaces
   * @returns {Array} Array of workspace objects with active status
   */
  async listWorkspaces(showAll) {
    try {
      const config = await loadConfig();

      if (showAll) {
        return {
          workspaces: config.workspaces,
          message: `\nAll available workspaces :`
        };
      }

      return {
        workspaces: config.workspaces.filter(ws => ws.profile === config.activeProfile),
        message: `\nAvailable workspaces in ${config.activeProfile} profile:`
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove a specific workspace
   * @param {string} workspaceName - Name of the workspace to remove
   * @returns {Object} Result object with success status and message
   */
  async removeWorkspace(workspaceName) {
    try {
      if (!workspaceName || workspaceName.trim() === '') {
        return { success: false, message: 'Workspace name cannot be empty' };
      }

      const cleanedName = cleanName(workspaceName);
      const config = await loadConfig();

      if (!config.workspaces.find(workspace => workspace.name === cleanedName)) {
        return { success: false, message: `Workspace "${cleanedName}" does not exist` };
      } else {
        const workspaces = config.workspaces;
        const index = workspaces.findIndex(workspaces => workspaces.name === cleanedName);

        if (index !== -1) {
          config.workspaces.splice(index, 1);
        }

        await saveConfig(config);

        return {
          success: true,
          removedWorkspace: cleanedName
        };
      }
    } catch (error) {
      throw error;
    }
  }
}

export default WorkspaceManager;