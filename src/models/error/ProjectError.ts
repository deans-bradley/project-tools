import { ERROR_DOMAIN, ErrorType } from "../constants";
import { BusinessError } from "./BusinessError";

const DEFAULT_CONTEXT = 'project';

class ProjectError extends BusinessError {
  constructor(errorType: ErrorType, context: string = DEFAULT_CONTEXT, message?: string) {
    super(ERROR_DOMAIN.PROJECT, errorType, context, message);
  }
}

export { ProjectError };

