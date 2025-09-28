import chalk from 'chalk';
import { loadConfig, saveConfig } from '../utils/configUtils.js';
import { generateId, cleanName } from '../utils/commonUtils.js';

/**
 * WorkspaceManager - Handles all workspace-related operations
 */
class WorkspaceManager {
  /**
   * Add a new workspace
   * @param {string} workspaceName - Name of the workspace to create
   * @returns {Object} Result object with success status and message
   */
  async addWorkspace(workspaceName) {
    try {   
      if (!workspaceName || workspaceName.trim() === '') {
        return { success: false, message: 'workspace name cannot be empty' };
      }

      const cleanedName = cleanName(workspaceName);
      
      if (cleanedName !== workspaceName.trim().toLowerCase()) {
        console.log(chalk.yellow(`📝 workspace name cleaned: "${workspaceName}" → "${cleanedName}"`));
      }

      const config = await loadConfig();
      const existingWorkspace = config.workspaces.find(p => p.name === cleanedName);

      if (existingWorkspace) {
        return { success: false, message: `workspace "${cleanedName}" already exists` };
      }

      const newWorkspace = {
        id: generateId('ws'),
        name: cleanedName,
        profile: config.activeProfile,
        created: new Date().toISOString()
      };

      config.workspaces.push(newWorkspace);
      await saveConfig(config);

      return { 
        success: true,
        workspaceName: cleanedName 
      };
    } catch (error) {
      return { success: false, message: error.message };
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
          message: `\n📋 All available workspaces :`
        };
      }

      return {
        workspaces: config.workspaces.filter(ws => ws.profile === config.activeProfile),
        message: `\n📋 Available workspaces in ${config.activeProfile} profile:`
      };
    } catch (error) {
      console.error(chalk.red('❌ Error loading workspaces:'), error.message);
      return [];
    }
  }

  // TODO: The remove command should also remove all child projects.
  // For now the command will just remove the workspace only.
  /**
   * Remove a specific workspace
   * @param {string} workspaceName - Name of the workspace to remove
   * @returns {Object} Result object with success status and message
   */
  async removeWorkspace(workspaceName) {
    try {
      if (!workspaceName || workspaceName.trim() === '') {
        return { success: false, message: 'workspace name cannot be empty' };
      }

      const cleanedName = cleanName(workspaceName);
      const config = await loadConfig();

      if (!config.workspaces.find(workspace => workspace.name === cleanedName)) {
        return { success: false, message: `workspace "${cleanedName}" does not exist` };
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
      return { success: false, message: error.message };
    }
  }
}

export default WorkspaceManager;