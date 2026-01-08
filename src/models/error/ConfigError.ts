import { ERROR_DOMAIN, ErrorType } from "../constants";
import { BusinessError } from "./BusinessError";

const DEFAULT_CONTEXT = 'configuration';

class ConfigError extends BusinessError {
  constructor(errorType: ErrorType, context: string = DEFAULT_CONTEXT, message?: string) {
    super(ERROR_DOMAIN.CONFIG, errorType, context, message);
  }
}

export { ConfigError };

