import chalk from 'chalk';
import { Command } from 'commander';
import { ConfigManager } from '../managers/index';

/**
 * Setup configuration-related CLI commands
 */
export function setupConfigCommands(program: Command) {
  const configManager = new ConfigManager();

  const configCommand = program
    .command('config')
    .description('Manage ProjectTools configuration');

  configCommand
    .command('show')
    .description('Show current configuration')
    .action(async () => {
      try {
        const config = await configManager.loadConfig();
        const profiles = config.profiles;

        const workspaces = profiles.flatMap(p => p.workspaces);
        const projects = workspaces.flatMap(w => w.projects);
        const activeProfile = profiles.find(p => p.isActive)?.name;

        console.log(chalk.cyan('\nProjectTools Configuration:'));
        console.log(chalk.gray('─'.repeat(40)));
        console.log(`Default projects path: ${chalk.yellow(config.settings?.defaultPath || 'Not set')}`);
        console.log(`Active profile: ${chalk.yellow(activeProfile || 'None')}`);
        console.log(`Profiles: ${chalk.yellow(profiles.length || 0)}`);
        console.log(`Workspaces: ${chalk.yellow(workspaces.length || 0)}`);
        console.log(`Projects: ${chalk.yellow(projects.length || 0)}`);
        console.log(`Config file: ${chalk.gray(configManager.getConfigPath())}`);
        console.log('');
      } catch (error: any) {
        console.error(chalk.red(error.message));
      }
    });

  configCommand
    .command('set')
    .argument('<key>', 'Configuration key')
    .argument('<value>', 'Configuration value')
    .description('Set a configuration value')
    .action(async (key, value) => {
      try {
        await configManager.setSetting(key, value);
        console.log(chalk.green(`Setting '${key}' set to: ${value}`));
      } catch (error: any) {
        console.error(chalk.red(error.message));
      }
    });
}