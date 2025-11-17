import chalk from 'chalk';
import { cleanName } from '../utils/commonUtils.js';

/**
 * Setup configuration-related CLI commands
 * @param {Object} program - Commander.js program instance
 * @param {ProfileManager} profileManager - ProfileManager instance
 */
export function setupProfileCommands(program, profileManager) {
  const profileCommand = program
    .command('profile')
    .description('Manage profiles');

  profileCommand
    .command('add <profileName>')
    .description('Create a new profile')
    .action(async (profileName) => {
      try {
        const isFirstProfile = await profileManager.addProfile(profileName);
        console.log(chalk.green(`Profile "${cleanName(profileName)}" created successfully!`));
        
        if (isFirstProfile) {
          console.log(chalk.blue(`"${cleanName(profileName)}" is now your active profile`));
        }
      } catch (error) {
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
      } catch (error) {
        console.error(chalk.red(error.message));
      }
    });

  profileCommand
    .command('switch <profileName>')
    .description('Switch profiles')
    .action(async (profileName) => {
      try {
        await profileManager.switchProfile(profileName);
        console.log(chalk.green(`Switched to profile "${cleanName(profileName)}"`));
      } catch (error) {
        console.error(chalk.red(error.message));
      }
    });

  profileCommand
    .command('remove <profileName>')
    .description('Remove a specific profile')
    .action(async (profileName) => {
      try {
        const result = await profileManager.removeProfile(profileName);
        console.log(chalk.green(`Profile "${result.removedProfile}" removed`));

        if (result.activeProfileChanged && result.activeProfile) {
          console.log(chalk.blue(`"${result.activeProfile}" is now your active profile`));
        } else if (result.activeProfileChanged && !result.activeProfile) {
          console.log(chalk.yellow('No profiles found. Create one with: pt profile add <name>'));
        }
      } catch (error) {
        console.error(chalk.red(error.message));
      }
    });
}