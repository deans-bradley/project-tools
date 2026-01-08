import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class InvalidJsonError extends BusinessError {
  constructor(errorDomain: ErrorDomain, resource: string, message?: string) {
    const errorMessage = message || `Invalid JSON found in '${resource}'`;
    super(errorDomain, ERROR_TYPE.INVALID_JSON, errorMessage);
  }
}

export { InvalidJsonError };

