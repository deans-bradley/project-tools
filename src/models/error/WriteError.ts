import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class WriteError extends BusinessError {
  constructor(errorDomain: ErrorDomain, resource: string, message?: string) {
    const errorMessage = message || `'${resource}' already exists`;
    super(errorDomain, ERROR_TYPE.WRITE_ERROR, errorMessage);
  }
}

export { WriteError };

