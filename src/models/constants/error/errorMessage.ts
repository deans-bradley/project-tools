import { ERROR_TYPE } from './errorType';

/**
 * Base Error Messages
 * Template messages for common error types
 */
export const ERROR_MESSAGE = {
  [ERROR_TYPE.NOT_FOUND]: "{context} not found",
  [ERROR_TYPE.ALREADY_EXISTS]: "{context} already exists",
  [ERROR_TYPE.ACCESS_DENIED]: "Access denied to {context}",
  [ERROR_TYPE.EMPTY_REQUIRED_FIELD]: "{context} cannot be empty",
  [ERROR_TYPE.INVALID_FORMAT]: "Invalid {context} format",
  [ERROR_TYPE.INVALID_VALUE]: "Invalid {context} value",
  [ERROR_TYPE.VALIDATION_FAILED]: "{context} validation failed",
  [ERROR_TYPE.READ_ERROR]: "Failed to read {context}",
  [ERROR_TYPE.WRITE_ERROR]: "Failed to write {context}",
  [ERROR_TYPE.PERMISSION_DENIED]: "Permission denied accessing {context}",
  [ERROR_TYPE.DISK_FULL]: "Insufficient disk space for {context}",
  [ERROR_TYPE.INVALID_JSON]: "{context} contains invalid JSON",
  [ERROR_TYPE.PARSE_ERROR]: "Failed to parse {context}",
  [ERROR_TYPE.INITIALIZATION_FAILED]: "Failed to initialize {context}",
  [ERROR_TYPE.OPERATION_FAILED]: "{context} operation failed",
  [ERROR_TYPE.RESTORE_FAILED]: "Failed to restore {context}",
  [ERROR_TYPE.BACKUP_FAILED]: "Failed to backup {context}"
} as const;

/**
 * Creates a formatted error message
 */
function createErrorMessage(errorType: number, context: string): string {
  const template = ERROR_MESSAGE[errorType as keyof typeof ERROR_MESSAGE];
  if (!template) {
    return "Unknown error occurred";
  }
  
  return template.replace(/\{(\w+)\}/g, (match, message) => {
    return message === 'context' ? context : match;
  });
}

export { createErrorMessage };

