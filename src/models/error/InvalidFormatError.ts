import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class InvalidFormatError extends BusinessError {
  constructor(errorDomain: ErrorDomain, name: string, expectedFormat: string, message?: string) {
    const errorMessage = message || `Incorrect format for '${name}', expected: ${expectedFormat}`;
    super(errorDomain, ERROR_TYPE.INVALID_FORMAT, errorMessage);
  }
}

export { InvalidFormatError };

