import { ERROR_DOMAIN, ErrorType } from "../constants";
import { BusinessError } from "./BusinessError";

const DEFAULT_CONTEXT = "settings";

class SettingsError extends BusinessError {
  constructor(errorType: ErrorType, context: string = DEFAULT_CONTEXT, message?: string) {
    super(ERROR_DOMAIN.SETTINGS, errorType, context, message);
  }
}

export { SettingsError };

