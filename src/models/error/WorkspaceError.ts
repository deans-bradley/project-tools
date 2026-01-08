import { ERROR_DOMAIN, ErrorType } from "../constants";
import { BusinessError } from "./BusinessError";

const DEFAULT_CONTEXT = 'workspace';

class WorkspaceError extends BusinessError {
  constructor(errorType: ErrorType, context: string = DEFAULT_CONTEXT, message?: string) {
    super(ERROR_DOMAIN.WORKSPACE, errorType, context, message);
  }
}

export { WorkspaceError };

