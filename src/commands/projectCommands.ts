import chalk from 'chalk';
import { Command } from 'commander';
import { ProjectManager } from '../managers';

/**
 * Setup project-related CLI commands
 */
export function setupProjectCommands(program: Command): void {
  const projectManager = new ProjectManager();

  const projectCommand = program
    .command('project')
    .description('Manage projects');

  projectCommand
    .command('add <projectName> <workspaceName>')
    .description('Create a new project')
    .option('-p, --path <path>', 'Set the project path')
    .option('--profile <profile>', 'Profile to add project to')
    .action(async (projectName: string, workspaceName: string, options: { path?: string; profile?: string }) => {
      try {
        const cleanedProjectName = await projectManager.addProject(projectName, workspaceName, options);
        console.log(chalk.green(`Project "${cleanedProjectName}" created successfully!`));
      } catch (error: any) {
        console.error(chalk.red(error.message));
      }
    });
}