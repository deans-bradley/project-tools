/**
 * Error Domain Codes
 * Base multipliers for different domains
 */
export const ERROR_DOMAIN = {
  APP: 100,
  CONFIG: 200,
  SETTINGS: 300,
  PROFILE: 400,
  WORKSPACE: 500,
  PROJECT: 600
} as const;

export type ErrorDomain = typeof ERROR_DOMAIN[keyof typeof ERROR_DOMAIN];

