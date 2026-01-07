import { ERROR_TYPE } from './errorType';

/**
 * Base Error Messages
 * Template messages for common error types
 */
export const ERROR_MESSAGE = {
  [ERROR_TYPE.NOT_FOUND]: "{placeholder} not found",
  [ERROR_TYPE.ALREADY_EXISTS]: "{placeholder} already exists",
  [ERROR_TYPE.ACCESS_DENIED]: "Access denied to {placeholder}",
  [ERROR_TYPE.EMPTY_REQUIRED_FIELD]: "{placeholder} cannot be empty",
  [ERROR_TYPE.INVALID_FORMAT]: "Invalid {placeholder} format",
  [ERROR_TYPE.INVALID_VALUE]: "Invalid {placeholder} value",
  [ERROR_TYPE.VALIDATION_FAILED]: "{placeholder} validation failed",
  [ERROR_TYPE.READ_ERROR]: "Failed to read {placeholder}",
  [ERROR_TYPE.WRITE_ERROR]: "Failed to write {placeholder}",
  [ERROR_TYPE.PERMISSION_DENIED]: "Permission denied accessing {placeholder}",
  [ERROR_TYPE.DISK_FULL]: "Insufficient disk space for {placeholder}",
  [ERROR_TYPE.INVALID_JSON]: "{placeholder} contains invalid JSON",
  [ERROR_TYPE.PARSE_ERROR]: "Failed to parse {placeholder}",
  [ERROR_TYPE.INITIALIZATION_FAILED]: "Failed to initialize {placeholder}",
  [ERROR_TYPE.OPERATION_FAILED]: "{placeholder} operation failed",
  [ERROR_TYPE.RESTORE_FAILED]: "Failed to restore {placeholder}",
  [ERROR_TYPE.BACKUP_FAILED]: "Failed to backup {placeholder}"
} as const;

/**
 * Creates a formatted error message
 */
function createErrorMessage(errorType: number, placeholder: string): string {
  const template = ERROR_MESSAGE[errorType as keyof typeof ERROR_MESSAGE];
  if (!template) {
    return "Unknown error occurred";
  }
  
  return template.replace(/\{(\w+)\}/g, (match, message) => {
    return message === 'placeholder' ? placeholder : match;
  });
}

export { createErrorMessage };

