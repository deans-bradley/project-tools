import chalk from 'chalk';
import { Command } from 'commander';
import { WorkspaceManager } from '../managers';
import { Profile, Workspace } from '../models';

/**
 * Setup workspace-related CLI commands
 */
export function setupWorkspaceCommands(program: Command): void {
  const workspaceManager = new WorkspaceManager();

  const workspaceCommand = program
    .command('workspace')
    .description('Manage workspaces');

  workspaceCommand
    .command('add <workspaceName>')
    .description('Create a new workspace')
    .option('-p, --path <path>', 'Set the workspace path')
    .option('--profile <profile>', 'Profile to add workspace to')
    .action(async (workspaceName: string, options: { path?: string; profile?: string }) => {
      try {
        const cleanedWorkspaceName = await workspaceManager.addWorkspace(workspaceName, options);
        console.log(chalk.green(`Workspace "${cleanedWorkspaceName}" created successfully!`));
      } catch (error: any) {
        console.error(chalk.red(error.message));
      }
    });

  workspaceCommand
    .command('list')
    .description('List all workspaces')
    .option('-a, --all', 'List all workspaces')
    .action(async (options: { all?: boolean }) => {
      try {
        const result = await workspaceManager.listWorkspaces(options);
        if (result.length === 0) {
          console.log(chalk.yellow('No workspaces found. Create one with: pt workspace add <name>'));
        } 
        
        if (options.all) {
          (result as Profile[]).forEach(profile => {
            console.log(chalk.cyan(`${profile.name}:`));
            profile.workspaces.forEach(workspace => {
              console.log(`  ○ ${workspace.name}`);
            });
          });
        } else {
          console.log(chalk.cyan('Current Workspaces'));
          (result as Workspace[]).forEach(workspace => {
            console.log(`  ○ ${workspace.name}`);
          });
        }
      } catch (error: any) {
        console.error(chalk.red(error.message));
      }
    });

  workspaceCommand
    .command('remove <workspaceName>')
    .description('Remove a specific workspace')
    .option('--profile <profile>', 'Profile to remove workspace from')
    .action(async (workspaceName: string, options: { profile?: string }) => {
      try {
        const cleanedWorkspaceName = await workspaceManager.removeWorkspace(workspaceName, options);
        console.log(chalk.green(`Workspace "${cleanedWorkspaceName}" removed`));
      } catch (error: any) {
        console.error(chalk.red(error.message));
      }
    });
}