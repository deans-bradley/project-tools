import { ERROR_DOMAIN, ErrorType } from "../constants";
import { BusinessError } from "./BusinessError";

const DEFAULT_CONTEXT = 'profile';

class ProfileError extends BusinessError {
  constructor(errorType: ErrorType, context: string, message?: string) {
    super(ERROR_DOMAIN.PROFILE, errorType, context || DEFAULT_CONTEXT, message);
  }
}

export { ProfileError };

