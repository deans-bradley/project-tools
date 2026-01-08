import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class ReadError extends BusinessError {
  constructor(errorDomain: ErrorDomain, resource: string, message?: string) {
    const errorMessage = message || `Failed to read ${resource}`;
    super(errorDomain, ERROR_TYPE.READ_ERROR, errorMessage);
  }
}

export { ReadError };

