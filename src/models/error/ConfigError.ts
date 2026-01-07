import { ERROR_DOMAIN, ERROR_TYPE, ErrorType, createErrorMessage } from '../constants';
import { BusinessError } from './BusinessError';

const CONFIG_ERROR_MESSAGE = Object.freeze({
  [ERROR_TYPE.NOT_FOUND]: createErrorMessage(ERROR_TYPE.NOT_FOUND, "Configuration file"),
  [ERROR_TYPE.PERMISSION_DENIED]: createErrorMessage(ERROR_TYPE.PERMISSION_DENIED, "configuration file"),
  [ERROR_TYPE.INVALID_JSON]: createErrorMessage(ERROR_TYPE.INVALID_JSON, "Configuration file"),
  [ERROR_TYPE.READ_ERROR]: createErrorMessage(ERROR_TYPE.READ_ERROR, "configuration"),
  [ERROR_TYPE.VALIDATION_FAILED]: createErrorMessage(ERROR_TYPE.VALIDATION_FAILED, "Existing configuration"),
  [ERROR_TYPE.WRITE_ERROR]: createErrorMessage(ERROR_TYPE.WRITE_ERROR, "configuration"),
  [ERROR_TYPE.DISK_FULL]: createErrorMessage(ERROR_TYPE.DISK_FULL, "configuration"),
  [ERROR_TYPE.INITIALIZATION_FAILED]: createErrorMessage(ERROR_TYPE.INITIALIZATION_FAILED, "configuration"),
  [ERROR_TYPE.RESTORE_FAILED]: createErrorMessage(ERROR_TYPE.RESTORE_FAILED, "configuration backup")
});

class ConfigError extends BusinessError {
  constructor(errorType: ErrorType, message?: string | undefined) {
    const errorMessage = message || CONFIG_ERROR_MESSAGE[errorType as keyof typeof CONFIG_ERROR_MESSAGE];
    super(ERROR_DOMAIN.CONFIG, errorType, errorMessage || `Unknown configuration error: ${errorType}`);
  }
}

export { ConfigError };

