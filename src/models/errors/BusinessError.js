import { 
  ERROR_DOMAIN,
  CONFIG_ERROR_MESSAGE,
  PROFILE_ERROR_MESSAGE,
  WORKSPACE_ERROR_MESSAGE,
  PROJECT_ERROR_MESSAGE,
  createErrorMessage
} from '../constants/index.js';

/**
 * Domain name mappings for error context
 */
const DOMAIN_NAMES = Object.freeze({
  [ERROR_DOMAIN.CONFIG]: 'Config',
  [ERROR_DOMAIN.PROFILE]: 'Profile',
  [ERROR_DOMAIN.WORKSPACE]: 'Workspace',
  [ERROR_DOMAIN.PROJECT]: 'Project',
  [ERROR_DOMAIN.GENERAL]: 'General'
});

const BUSINESS_ERROR_MESSAGES = Object.freeze({
  ...CONFIG_ERROR_MESSAGE,
  ...PROFILE_ERROR_MESSAGE,
  ...WORKSPACE_ERROR_MESSAGE,
  ...PROJECT_ERROR_MESSAGE
});

/**
 * Unified business error class for all domain operations
 * Replaces individual ConfigError, ProfileError, WorkspaceError, ProjectError classes
 */
class BusinessError extends Error {
  /**
   * Create a new BusinessError instance
   * @param {number} code - Full error code (domain + base type)
   * @param {string|null} message - Custom message (optional)
   * @param {Error|null} originalError - Original error that caused this (optional)
   * @param {Object} context - Additional context for error handling (optional)
   */
  constructor(code, message = null, originalError = null, context = {}) {
    // Extract domain and base type from code
    const domain = Math.floor(code / 100) * 100;
    const baseType = code % 100;
    
    // Determine domain name
    const domainName = DOMAIN_NAMES[domain] || 'Unknown';
    
    // Use provided message or generate from base type and context
    let errorMessage = message || BUSINESS_ERROR_MESSAGES[code];
    if (!errorMessage)
      errorMessage = BusinessError.getErrorMessage(code, context);
    
    super(errorMessage);
    
    this.name = `${domainName}Error`;
    this.code = code;
    this.domain = domain;
    this.domainName = domainName;
    this.baseType = baseType;
    this.originalError = originalError;
    this.context = context;
    
    // Maintain stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BusinessError);
    }
  }

  /**
   * Get appropriate error message for a code
   * @param {number} code - Error code
   * @param {Object} context - Context for message formatting
   * @returns {string} Formatted error message
   */
  static getErrorMessage(code, context = {}) {
    const baseType = code % 100;
    
    // Create default context if not provided
    const messageContext = {
      resource: context.resource,
      field: context.field,
      operation: context.operation,
      ...context
    };
    
    return createErrorMessage(baseType, messageContext);
  }

  /**
   * Create a BusinessError from domain and base type
   * @param {number} domain - Domain code from ERROR_DOMAIN
   * @param {number} baseType - Base error type from BASE_ERROR_TYPE
   * @param {string|null} message - Custom message (optional)
   * @param {Error|null} originalError - Original error (optional)
   * @param {Object} context - Additional context (optional)
   * @returns {BusinessError} New error instance
   */
  static fromDomain(domain, baseType, message = null, originalError = null, context = {}) {
    const code = domain + baseType;
    return new BusinessError(code, message, originalError, context);
  }

  /**
   * Create human-readable string representation
   * @returns {string} Formatted error string
   */
  toString() {
    return `${this.name} [${this.code}]: ${this.message}`;
  }
}

export { BusinessError, DOMAIN_NAMES };