import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class ResourceAlreadyExistsError extends BusinessError {
  constructor(errorDomain: ErrorDomain, resource: string, message?: string) {
    const errorMessage = message || `'${resource}' already exists`;
    super(errorDomain, ERROR_TYPE.ALREADY_EXISTS, errorMessage);
  }
}

export { ResourceAlreadyExistsError };

