/**
 * Error Domain Codes
 * Base multipliers for different domains
 */
export const ERROR_DOMAIN = {
  CONFIG: 100,
  SETTINGS: 200,
  PROFILE: 300,
  WORKSPACE: 400,
  PROJECT: 500,
  UNKOWN: 900
} as const;

export type ErrorDomain = typeof ERROR_DOMAIN[keyof typeof ERROR_DOMAIN];

