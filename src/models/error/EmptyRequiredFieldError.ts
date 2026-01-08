import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class EmptyRequiredFieldError extends BusinessError {
  constructor(errorDomain: ErrorDomain, field: string, message?: string) {
    const errorMessage = message || `Field '${field}' is required`;
    super(errorDomain, ERROR_TYPE.EMPTY_REQUIRED_FIELD, errorMessage);
  }
}

export { EmptyRequiredFieldError };

