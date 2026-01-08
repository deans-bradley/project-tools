import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class BackupFailedError extends BusinessError {
  constructor(errorDomain: ErrorDomain, resource: string, message?: string) {
    const errorMessage = message || `Failed to backup ${resource}`;
    super(errorDomain, ERROR_TYPE.BACKUP_FAILED, errorMessage);
  }
}

export { BackupFailedError };

