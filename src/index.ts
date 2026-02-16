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

import { setupConfigCommands, setupProfileCommands, setupWorkspaceCommands } from './commands/index';

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

setupConfigCommands(program);
setupProfileCommands(program);
setupWorkspaceCommands(program);
// setupProjectCommands(program, projectManager);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}