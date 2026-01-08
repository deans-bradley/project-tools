import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class AccessToResourceDeniedError extends BusinessError {
  constructor(errorDomain: ErrorDomain, resource: string, message?: string) {
    const errorMessage = message || `Access forbidden to '${resource}'`;
    super(errorDomain, ERROR_TYPE.ACCESS_DENIED, errorMessage);
  }
}

export { AccessToResourceDeniedError };

