import { createErrorCode, ErrorDomain, ErrorType } from "../constants";

class BusinessError extends Error {
  override readonly name: string;
  readonly errorCode: string;
  readonly errorDomain: ErrorDomain;
  readonly errorType: ErrorType;

  constructor(errorDomain: ErrorDomain, errorType: ErrorType, message?: string) {
    const errorCode = createErrorCode(errorDomain, errorType);
    super(message || `An error occured with code: ${errorCode}`);
    this.name = this.constructor.name;
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

