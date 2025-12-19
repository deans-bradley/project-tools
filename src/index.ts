#!/usr/bin/env node

import chalk from 'chalk';
import { program } from 'commander';
import { version } from '../package.json';

/**
 * ProjectTools CLI Entry Point
 * 
 * This is the main entry point for the ProjectTools CLI application.
 * It sets up the commander.js program and registers all available commands.
 */

// import { setupConfigCommands } from '../src/commands/configCommands.js';
// import { setupProfileCommands } from '../src/commands/profileCommands.js';
// import { setupProjectCommands } from '../src/commands/projectCommands.js';
// import { setupWorkspaceCommands } from '../src/commands/workspaceCommands.js';
// import ConfigManager from '../src/managers/ConfigManager.js';
// import ProfileManager from '../src/managers/ProfileManager.js';
// import ProjectManager from '../src/managers/ProjectManager.js';
// import WorkspaceManager from '../src/managers/WorkspaceManager.js';

// const configManager = new ConfigManager();
// const profileManager = new ProfileManager();
// const projectManager = new ProjectManager();
// const workspaceManager = new WorkspaceManager();

program
  .name('pt')
  .description('ProjectTools - Manage your development projects across workspaces and profiles.')
  .version(version);

program
  .command('hello')
  .description('Test command to verify installation')
  .action(() => {
    console.log(chalk.green('ProjectTools is working!'));
    console.log(chalk.blue('Ready to manage your projects with ease!'));
  });

program.action(() => {
  console.log(chalk.cyan('Welcome to ProjectTools!'));
  console.log('Use --help to see available commands.');
});

// setupConfigCommands(program, configManager);
// setupProfileCommands(program, profileManager);
// setupProjectCommands(program, projectManager);
// setupWorkspaceCommands(program, workspaceManager);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}