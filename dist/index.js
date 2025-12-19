#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const package_json_1 = require("../package.json");
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
commander_1.program
    .name('pt')
    .description('ProjectTools - Manage your development projects across workspaces and profiles.')
    .version(package_json_1.version);
commander_1.program
    .command('hello')
    .description('Test command to verify installation')
    .action(() => {
    console.log(chalk_1.default.green('ProjectTools is working!'));
    console.log(chalk_1.default.blue('Ready to manage your projects with ease!'));
});
commander_1.program.action(() => {
    console.log(chalk_1.default.cyan('Welcome to ProjectTools!'));
    console.log('Use --help to see available commands.');
});
// setupConfigCommands(program, configManager);
// setupProfileCommands(program, profileManager);
// setupProjectCommands(program, projectManager);
// setupWorkspaceCommands(program, workspaceManager);
commander_1.program.parse(process.argv);
if (!process.argv.slice(2).length) {
    commander_1.program.outputHelp();
}
//# sourceMappingURL=index.js.map