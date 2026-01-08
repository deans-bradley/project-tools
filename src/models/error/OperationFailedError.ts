import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class OperationFailedError extends BusinessError {
  constructor(errorDomain: ErrorDomain, operation: string, message?: string) {
    const errorMessage = message || `Failed to ${operation}`;
    super(errorDomain, ERROR_TYPE.OPERATION_FAILED, errorMessage);
  }
}

export { OperationFailedError };

