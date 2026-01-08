import { createErrorCode, createErrorMessage, ErrorDomain, ErrorType } from "../constants";

class BusinessError extends Error {
  readonly errorCode: string;
  readonly errorDomain: ErrorDomain;
  readonly errorType: ErrorType;

  constructor(errorDomain: ErrorDomain, errorType: ErrorType, context: string, message?: string) {
    const errorCode = createErrorCode(errorDomain, errorType);
    if (!message) {
      message = createErrorMessage(errorType, context);
    }

    super(message || `An error occured with code: ${errorCode}`);
    this.errorCode = errorCode;
    this.errorDomain = errorDomain;
    this.errorType = errorType;

    // Maintain stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BusinessError);
    }
  }
}

export { BusinessError };

