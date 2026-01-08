import { ERROR_TYPE, ErrorDomain } from "../constants";
import { BusinessError } from "./BusinessError";

class DiskFullError extends BusinessError {
  constructor(errorDomain: ErrorDomain, resource: string, message?: string) {
    const errorMessage = message || `Failed to save ${resource}: Disk space is full`;
    super(errorDomain, ERROR_TYPE.DISK_FULL, errorMessage);
  }
}

export { DiskFullError };

