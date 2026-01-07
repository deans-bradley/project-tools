/**
 * Base Error Types
 * Generic error categories that can be reused across domains
 */
export const BASE_ERROR_TYPE = {
  // Resource errors (1-19)
  NOT_FOUND: 1,
  ALREADY_EXISTS: 2,
  ACCESS_DENIED: 3,
  
  // Validation errors (20-39)
  EMPTY_REQUIRED_FIELD: 20,
  INVALID_FORMAT: 21,
  INVALID_VALUE: 22,
  VALIDATION_FAILED: 23,
  
  // I/O errors (40-59)
  READ_ERROR: 40,
  WRITE_ERROR: 41,
  PERMISSION_DENIED: 42,
  DISK_FULL: 43,
  
  // Parsing errors (60-79)
  INVALID_JSON: 60,
  PARSE_ERROR: 61,
  
  // Operation errors (80-99)
  INITIALIZATION_FAILED: 80,
  OPERATION_FAILED: 81,
  RESTORE_FAILED: 82,
  BACKUP_FAILED: 83
} as const;

/**
 * Error Domain Codes
 * Base multipliers for different domains
 */
export const ERROR_DOMAIN = {
  CONFIG: 100,
  PROFILE: 200,
  WORKSPACE: 300,
  PROJECT: 400,
  GENERAL: 500
} as const;

/**
 * Creates a domain-specific error code
 */
function createErrorCode(domain: number, type: number): number {
  return domain + type;
}

/**
 * Base Error Messages
 * Template messages for common error types
 */
export const BASE_ERROR_MESSAGE = {
  [BASE_ERROR_TYPE.NOT_FOUND]: "{resource} not found",
  [BASE_ERROR_TYPE.ALREADY_EXISTS]: "{resource} already exists",
  [BASE_ERROR_TYPE.ACCESS_DENIED]: "Access denied to {resource}",
  [BASE_ERROR_TYPE.EMPTY_REQUIRED_FIELD]: "{field} cannot be empty",
  [BASE_ERROR_TYPE.INVALID_FORMAT]: "Invalid {field} format",
  [BASE_ERROR_TYPE.INVALID_VALUE]: "Invalid {field} value",
  [BASE_ERROR_TYPE.VALIDATION_FAILED]: "{resource} validation failed",
  [BASE_ERROR_TYPE.READ_ERROR]: "Failed to read {resource}",
  [BASE_ERROR_TYPE.WRITE_ERROR]: "Failed to write {resource}",
  [BASE_ERROR_TYPE.PERMISSION_DENIED]: "Permission denied accessing {resource}",
  [BASE_ERROR_TYPE.DISK_FULL]: "Insufficient disk space for {resource}",
  [BASE_ERROR_TYPE.INVALID_JSON]: "{resource} contains invalid JSON",
  [BASE_ERROR_TYPE.PARSE_ERROR]: "Failed to parse {resource}",
  [BASE_ERROR_TYPE.INITIALIZATION_FAILED]: "Failed to initialize {resource}",
  [BASE_ERROR_TYPE.OPERATION_FAILED]: "{operation} operation failed",
  [BASE_ERROR_TYPE.RESTORE_FAILED]: "Failed to restore {resource}",
  [BASE_ERROR_TYPE.BACKUP_FAILED]: "Failed to backup {resource}"
} as const;

/**
 * Creates a formatted error message
 */
function createErrorMessage(errorType: number, context: any = {}): string {
  const template = BASE_ERROR_MESSAGE[errorType as keyof typeof BASE_ERROR_MESSAGE];
  if (!template) {
    return "Unknown error occurred";
  }
  
  return template.replace(/\{(\w+)\}/g, (match: string, key: string) => {
    return context[key] || match;
  });
}

export type BaseErrorType = typeof BASE_ERROR_TYPE[keyof typeof BASE_ERROR_TYPE];
export type ErrorDomain = typeof ERROR_DOMAIN[keyof typeof ERROR_DOMAIN];
export type BaseErrorMessage = typeof BASE_ERROR_MESSAGE[keyof typeof BASE_ERROR_MESSAGE];
export { createErrorCode, createErrorMessage };

