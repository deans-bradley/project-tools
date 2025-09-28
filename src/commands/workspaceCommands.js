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
    .action(async (workspaceName) => {
      try {
        const result = await workspaceManager.addWorkspace(workspaceName);
        if (result.success) {
          console.log(chalk.green(`✅ Workspace "${result.workspaceName}" created successfully!`));
        } else {
          console.log(chalk.red(`❌ ${result.message}`));
        }
      } catch (error) {
        console.error(chalk.red('❌ Error creating workspace:'), error.message);
      }
    });

  workspaceCommand
    .command('list')
    .description('List all workspaces')
    .option('-a, --all', 'list all worpspace')
    .action(async (options) => {
      try {
        const result = await workspaceManager.listWorkspaces(options.all);
        const workspaces = result.workspaces;
        if (workspaces.length === 0) {
          console.log(chalk.yellow('📝 No workspaces found. Create one with: pt workspace add <name>'));
        } else {
          console.log(chalk.cyan(result.message));
          workspaces.forEach(workspace => {
            console.log(`  ○ ${workspace.name}`);
          });
          console.log('');
        }
      } catch (error) {
        console.error(chalk.red('❌ Error listing workspaces:'), error.message);
      }
    });

  workspaceCommand
    .command('remove <workspaceName>')
    .description('Remove a specific workspace')
    .action(async (workspaceName) => {
      try {
        const result = await workspaceManager.removeWorkspace(workspaceName);
        if (result.success) {
          console.log(chalk.green(`✅ Workspace "${result.removedWorkspace}" removed`));
        } else {
          console.log(chalk.red(`❌ ${result.message}`));
        }
      } catch (error) {
        console.error(chalk.red('❌ Error deleting workspace:'), error.message);
      }
    });
}