import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class InvalidValueError extends BusinessError {
  constructor(errorDomain: ErrorDomain, fieldName: string, fieldValue: string, message?: string) {
    const errorMessage = message || `Value for '${fieldName}' cannot be '${fieldValue}'`;
    super(errorDomain, ERROR_TYPE.INVALID_VALUE, errorMessage);
  }
}

export { InvalidValueError };

