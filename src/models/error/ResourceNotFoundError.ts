import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class ResourceNotFoundError extends BusinessError {
  constructor(errorDomain: ErrorDomain, resource: string, message?: string) {
    const errorMessage = message || `Could not find '${resource}'`;
    super(errorDomain, ERROR_TYPE.NOT_FOUND, errorMessage);
  }
}

export { ResourceNotFoundError };

