/**
 * Error Types
 * Generic error categories that can be reused across domains
 */
export const ERROR_TYPE = {
  // Resource errors (1-19)
  NOT_FOUND: 1,
  ALREADY_EXISTS: 2,
  ACCESS_DENIED: 3,
  ALREADY_ACTIVE: 4,
  
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
 * Creates a domain-specific error code
 */
function createErrorCode(domainError: number, errorType: number): string {
  return `${domainError}:${errorType}`;
}

export type ErrorType = typeof ERROR_TYPE[keyof typeof ERROR_TYPE];
export { createErrorCode };

