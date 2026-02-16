import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class ResourceAlreadyActiveError extends BusinessError {
  constructor(errorDomain: ErrorDomain, resource: string, message?: string) {
    const errorMessage = message || `'${resource}' already active`;
    super(errorDomain, ERROR_TYPE.ALREADY_ACTIVE, errorMessage);
  }
}

export { ResourceAlreadyActiveError };

