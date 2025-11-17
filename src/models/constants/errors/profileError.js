import { BASE_ERROR_TYPE, ERROR_DOMAIN, createErrorCode, createErrorMessage } from './baseErrors.js';

/**
 * Profile Error Constants
 * Defines profile-specific error codes using base error types
 */
const PROFILE_ERROR = Object.freeze({
  PROFILE_NOT_FOUND: createErrorCode(ERROR_DOMAIN.PROFILE, BASE_ERROR_TYPE.NOT_FOUND),
  PROFILE_EMPTY_NAME: createErrorCode(ERROR_DOMAIN.PROFILE, BASE_ERROR_TYPE.EMPTY_REQUIRED_FIELD),
  PROFILE_ALREADY_EXISTS: createErrorCode(ERROR_DOMAIN.PROFILE, BASE_ERROR_TYPE.ALREADY_EXISTS),
  PROFILE_ALREADY_ACTIVE: createErrorCode(ERROR_DOMAIN.PROFILE, BASE_ERROR_TYPE.INVALID_VALUE)
});

/**
 * Profile Error Messages
 * Profile-specific error messages with proper context
 */
const PROFILE_ERROR_MESSAGE = Object.freeze({
  [PROFILE_ERROR.PROFILE_NOT_FOUND]: createErrorMessage(BASE_ERROR_TYPE.NOT_FOUND, { resource: "Profile" }),
  [PROFILE_ERROR.PROFILE_EMPTY_NAME]: createErrorMessage(BASE_ERROR_TYPE.EMPTY_REQUIRED_FIELD, { field: "Profile name" }),
  [PROFILE_ERROR.PROFILE_ALREADY_EXISTS]: createErrorMessage(BASE_ERROR_TYPE.ALREADY_EXISTS, { resource: "Profile" }),
  [PROFILE_ERROR.PROFILE_ALREADY_ACTIVE]: "Profile is already active"
});

export {
  PROFILE_ERROR,
  PROFILE_ERROR_MESSAGE
};