import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class InitializationFailedError extends BusinessError {
  constructor(errorDomain: ErrorDomain, resource: string, message?: string) {
    const errorMessage = message || `Failed to initialize ${resource}`;
    super(errorDomain, ERROR_TYPE.INITIALIZATION_FAILED, errorMessage);
  }
}

export { InitializationFailedError };

