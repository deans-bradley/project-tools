import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class RestoreFailedError extends BusinessError {
  constructor(errorDomain: ErrorDomain, resource: string, message?: string) {
    const errorMessage = message || `Failed to restore ${resource}`;
    super(errorDomain, ERROR_TYPE.RESTORE_FAILED, errorMessage);
  }
}

export { RestoreFailedError };

