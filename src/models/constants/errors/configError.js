import { BASE_ERROR_TYPE, ERROR_DOMAIN, createErrorCode, createErrorMessage } from './baseErrors.js';

/**
 * Config Error Constants
 * Defines config-specific error codes using base error types
 */
const CONFIG_ERROR = Object.freeze({
  NOT_FOUND: createErrorCode(ERROR_DOMAIN.CONFIG, BASE_ERROR_TYPE.NOT_FOUND),
  PERMISSION_DENIED: createErrorCode(ERROR_DOMAIN.CONFIG, BASE_ERROR_TYPE.PERMISSION_DENIED),
  LOAD_ERROR: createErrorCode(ERROR_DOMAIN.CONFIG, BASE_ERROR_TYPE.READ_ERROR),
  SAVE_ERROR: createErrorCode(ERROR_DOMAIN.CONFIG, BASE_ERROR_TYPE.WRITE_ERROR),
  DISK_FULL: createErrorCode(ERROR_DOMAIN.CONFIG, BASE_ERROR_TYPE.DISK_FULL),
  INVALID_JSON: createErrorCode(ERROR_DOMAIN.CONFIG, BASE_ERROR_TYPE.INVALID_JSON),
  INVALID_CONFIG: createErrorCode(ERROR_DOMAIN.CONFIG, BASE_ERROR_TYPE.INVALID_VALUE),
  INVALID_EXISTING_CONFIG: createErrorCode(ERROR_DOMAIN.CONFIG, BASE_ERROR_TYPE.VALIDATION_FAILED),
  INIT_ERROR: createErrorCode(ERROR_DOMAIN.CONFIG, BASE_ERROR_TYPE.INITIALIZATION_FAILED),
  RESTORE_ERROR: createErrorCode(ERROR_DOMAIN.CONFIG, BASE_ERROR_TYPE.RESTORE_FAILED)
});

/**
 * Config Error Messages
 * Config-specific error messages with proper context
 */
const CONFIG_ERROR_MESSAGE = Object.freeze({
  [CONFIG_ERROR.NOT_FOUND]: createErrorMessage(BASE_ERROR_TYPE.NOT_FOUND, { resource: "Configuration file" }),
  [CONFIG_ERROR.PERMISSION_DENIED]: createErrorMessage(BASE_ERROR_TYPE.PERMISSION_DENIED, { resource: "configuration file" }),
  [CONFIG_ERROR.INVALID_JSON]: createErrorMessage(BASE_ERROR_TYPE.INVALID_JSON, { resource: "Configuration file" }),
  [CONFIG_ERROR.LOAD_ERROR]: createErrorMessage(BASE_ERROR_TYPE.READ_ERROR, { resource: "configuration" }),
  [CONFIG_ERROR.INVALID_CONFIG]: "Invalid configuration object: must be an instance of Config",
  [CONFIG_ERROR.INVALID_EXISTING_CONFIG]: createErrorMessage(BASE_ERROR_TYPE.VALIDATION_FAILED, { resource: "Existing configuration" }),
  [CONFIG_ERROR.SAVE_ERROR]: createErrorMessage(BASE_ERROR_TYPE.WRITE_ERROR, { resource: "configuration" }),
  [CONFIG_ERROR.DISK_FULL]: createErrorMessage(BASE_ERROR_TYPE.DISK_FULL, { resource: "configuration" }),
  [CONFIG_ERROR.INIT_ERROR]: createErrorMessage(BASE_ERROR_TYPE.INITIALIZATION_FAILED, { resource: "configuration" }),
  [CONFIG_ERROR.RESTORE_ERROR]: createErrorMessage(BASE_ERROR_TYPE.RESTORE_FAILED, { resource: "configuration backup" })
});

export {
  CONFIG_ERROR,
  CONFIG_ERROR_MESSAGE
};