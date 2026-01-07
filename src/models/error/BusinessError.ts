import { createErrorCode, ErrorDomain, ErrorType } from "../constants";

class BusinessError extends Error {
  readonly errorCode: number;
  readonly errorDomain: ErrorDomain;
  readonly errorType: ErrorType;
  readonly errorMessage: string;

  constructor(errorDomain: ErrorDomain, errorType: ErrorType, message: string) {
    super(message);
    this.errorCode = createErrorCode(errorDomain, errorType);
    this.errorDomain = errorDomain;
    this.errorType = errorType;
    this.errorMessage = message;

    // Maintain stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BusinessError);
    }
  }
}

export { BusinessError };

