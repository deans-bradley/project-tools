/**
 * Settings Key Constants
 * Defines the available settings key constants and their corresponding values
 */
export const SETTINGS_KEY = {
  DEFAULT_PATH: 'default-path'
} as const;

/**
 * Settings Keys Display Names
 * Human-readable names for settings keys
 */
export const SETTINGS_KEY_NAME = {
  [SETTINGS_KEY.DEFAULT_PATH]: "Default path"
} as const;

export type SettingsKey = typeof SETTINGS_KEY[keyof typeof SETTINGS_KEY];
export type SettingsKeyName = typeof SETTINGS_KEY_NAME[keyof typeof SETTINGS_KEY_NAME];

