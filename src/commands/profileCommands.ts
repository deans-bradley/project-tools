import chalk from 'chalk';
import { Command } from 'commander';
import { ProfileManager } from '../managers';
import { cleanName } from '../utils/commonUtils';

/**
 * Setup profile-related CLI commands
 */
export function setupProfileCommands(program: Command): void {
  const profileManager = new ProfileManager();

  const profileCommand = program
    .command('profile')
    .description('Manage profiles');

  profileCommand
    .command('add <profileName>')
    .description('Create a new profile')
    .action(async (profileName: string) => {
      try {
        const isFirstProfile = await profileManager.addProfile(profileName);
        console.log(chalk.green(`Profile "${cleanName(profileName)}" created successfully!`));
        
        if (isFirstProfile) {
          console.log(chalk.blue(`"${cleanName(profileName)}" is now your active profile`));
        }
      } catch (error: any) {
        console.error(chalk.red(error.message));
      }
    });

  profileCommand
    .command('list')
    .description('List all profiles')
    .action(async () => {
      try {
        const profiles = await profileManager.listProfiles();
        if (profiles.length === 0) {
          console.log(chalk.yellow('No profiles found. Create one with: pt profile add <name>'));
        } else {
          console.log(chalk.cyan('\nAvailable Profiles:'));
          profiles.forEach(profile => {
            const indicator = profile.isActive ? chalk.green('● (active)') : chalk.gray('○');
            console.log(`  ${indicator} ${profile.name}`);
          });
          console.log('');
        }
      } catch (error: any) {
        console.error(chalk.red(error.message));
      }
    });

  profileCommand
    .command('switch <profileName>')
    .description('Switch profiles')
    .action(async (profileName: string) => {
      try {
        await profileManager.switchProfile(profileName);
        console.log(chalk.green(`Switched to profile "${cleanName(profileName)}"`));
      } catch (error: any) {
        console.error(chalk.red(error.message));
      }
    });

  profileCommand
    .command('remove <profileName>')
    .description('Remove a specific profile')
    .action(async (profileName: string) => {
      try {
        const result = await profileManager.removeProfile(profileName);
        console.log(chalk.green(`Profile "${result.removedProfile}" removed`));

        if (result.activeProfileChanged && result.activeProfile) {
          console.log(chalk.blue(`"${result.activeProfile}" is now your active profile`));
        } else if (result.activeProfileChanged && !result.activeProfile) {
          console.log(chalk.yellow('No profiles found. Create one with: pt profile add <name>'));
        }
      } catch (error: any) {
        console.error(chalk.red(error.message));
      }
    });
}