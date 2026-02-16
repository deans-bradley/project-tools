/**
 * Settings Key Constants
 * Defines the available settings key constants and their corresponding values
 */
export const SETTINGS_KEY = {
  DEFAULT_PATH: 'default-path'
} as const;

/**
 * Settings VALUES Map
 * Maps settings keys to their config property name
 */
export const SETTINGS = new Map<string, string>([
  [SETTINGS_KEY.DEFAULT_PATH, "defaultPath"]
]);

