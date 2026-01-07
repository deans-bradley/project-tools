import {
  CONFIG_ERROR_MESSAGE,
  ERROR_DOMAIN,
  PROFILE_ERROR_MESSAGE,
  PROJECT_ERROR_MESSAGE,
  WORKSPACE_ERROR_MESSAGE,
  createErrorMessage
} from '../constants/index';

import { ErrorContext } from './ErrorContext';

const DOMAIN_NAMES = {
  [ERROR_DOMAIN.CONFIG]: 'Config',
  [ERROR_DOMAIN.PROFILE]: 'Profile',
  [ERROR_DOMAIN.WORKSPACE]: 'Workspace',
  [ERROR_DOMAIN.PROJECT]: 'Project',
  [ERROR_DOMAIN.GENERAL]: 'General'
} as const;

const BUSINESS_ERROR_MESSAGE = {
  ...CONFIG_ERROR_MESSAGE,
  ...PROFILE_ERROR_MESSAGE,
  ...WORKSPACE_ERROR_MESSAGE,
  ...PROJECT_ERROR_MESSAGE
} as const;

class BusinessError extends Error {
  readonly errorName: string;
  readonly code: number;
  readonly domain: number;
  readonly domainName: string;
  readonly baseType: number;
  readonly originalError: Error | undefined | null;
  readonly context: ErrorContext;

  constructor(code: number, message?: string | null, originalError?: Error, context?: ErrorContext) {
    // Extract domain and base type from code
    const domain = Math.floor(code / 100) * 100;
    const baseType = code % 100;
    
    // Determine domain name
    const domainName = DOMAIN_NAMES[domain as keyof typeof DOMAIN_NAMES] || 'Unknown';
    
    // Use provided message or generate from base type and context
    let errorMessage = message || BUSINESS_ERROR_MESSAGE[code];
    if (!errorMessage) {
      errorMessage = BusinessError.getErrorMessage(code, context);
    }
      
    super(errorMessage);
    this.errorName = `${domainName}Error`;
    this.code = code;
    this.domain = domain;
    this.domainName = domainName;
    this.baseType = baseType;
    this.originalError = originalError;
    this.context = context || new ErrorContext();

    // Maintain stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BusinessError);
    }
  }

  /**
   * Get appropriate error message for a code
   */
  static getErrorMessage(code: number, context?: ErrorContext): string {
    const baseType = code % 100;
    return createErrorMessage(baseType, context);
  }

    /**
   * Create a BusinessError from domain and base type
   */
  static fromDomain(domain: number, baseType: number, message?: string, originalError?: Error, context?: ErrorContext): BusinessError {
    const code = domain + baseType;
    return new BusinessError(code, message, originalError, context);
  }

  /**
   * Create human-readable string representation
   */
  override toString(): string {
    return `${this.name} [${this.code}]: ${this.message}`;
  }
}

export { BusinessError };

