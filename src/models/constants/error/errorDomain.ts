/**
 * Error Domain Codes
 * Base multipliers for different domains
 */
export const ERROR_DOMAIN = {
  CONFIG: 100,
  SETTINGS: 200,
  PROFILE: 300,
  WORKSPACE: 400,
  PROJECT: 500
} as const;

export type ErrorDomain = typeof ERROR_DOMAIN[keyof typeof ERROR_DOMAIN];

// Profile Error Constants
export const PROFILE_ERROR = {
  PROFILE_NOT_FOUND: `${ERROR_DOMAIN.PROFILE}:${1}`,
  PROFILE_EMPTY_NAME: `${ERROR_DOMAIN.PROFILE}:${20}`,
  PROFILE_ALREADY_EXISTS: `${ERROR_DOMAIN.PROFILE}:${2}`,
  PROFILE_ALREADY_ACTIVE: `${ERROR_DOMAIN.PROFILE}:${22}`
} as const;

// Workspace Error Constants
export const WORKSPACE_ERROR = {
  NOT_FOUND: `${ERROR_DOMAIN.WORKSPACE}:${1}`,
  EMPTY_NAME: `${ERROR_DOMAIN.WORKSPACE}:${20}`,
  ALREADY_EXISTS: `${ERROR_DOMAIN.WORKSPACE}:${2}`,
  EMPTY_PATH: `${ERROR_DOMAIN.WORKSPACE}:${20}`,
  INVALID_PATH: `${ERROR_DOMAIN.WORKSPACE}:${22}`,
  EMPTY_PROFILE_NAME: `${ERROR_DOMAIN.WORKSPACE}:${20}`
} as const;

