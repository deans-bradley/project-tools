import chalk from 'chalk';

/**
 * Setup workspace-related CLI commands
 * @param {Object} program - Commander.js program instance
 * @param {ConfigManager} workspaceManager - WorkspaceManager instance
 */
export function setupWorkspaceCommands(program, workspaceManager) {
  const workspaceCommand = program
    .command('workspace')
    .description('Manage workspaces')

  workspaceCommand
    .command('add <workspaceName>')
    .description('Create a new workspace')
    .option('-p, --path <path>', 'Set the workspace path')
    .option('--profile <profile>', 'Profile to add workspace to')
    .action(async (workspaceName, options) => {
      try {
        const cleanedWorkspaceName = await workspaceManager.addWorkspace(workspaceName, options);
        console.log(chalk.green(`Workspace "${cleanedWorkspaceName}" created successfully!`));
      } catch (error) {
        console.error(chalk.red(error.message));
      }
    });

  workspaceCommand
    .command('list')
    .description('List all workspaces')
    .option('-a, --all', 'List all worpspace')
    .action(async (options) => {
      try {
        const result = await workspaceManager.listWorkspaces(options);
        if (result.length === 0) {
          console.log(chalk.yellow('No workspaces found. Create one with: pt workspace add <name>'));
        } 
        
        if (options.all) {
          result.forEach(profile => {
            console.log(chalk.cyan(`${profile.name}:`));
            profile.workspaces.forEach(workspace => {
              console.log(`  ○ ${workspace.name}`);
            });
          });
        } else {
          console.log(chalk.cyan('Current Workspaces'));
          result.forEach(workspace => {
            console.log(`  ○ ${workspace.name}`);
          });
        }
      } catch (error) {
        console.error(chalk.red(error.message));
      }
    });

  workspaceCommand
    .command('remove <workspaceName>')
    .description('Remove a specific workspace')
    .option('--profile <profile>', 'Profile to remove workspace from')
    .action(async (workspaceName, options) => {
      try {
        const cleanedWorkspaceName = await workspaceManager.removeWorkspace(workspaceName, options);
        console.log(chalk.green(`Workspace "${cleanedWorkspaceName}" removed`));
      } catch (error) {
        console.error(chalk.red(error.message));
      }
    });
}