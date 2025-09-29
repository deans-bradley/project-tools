/**
 * Custom error class for configuration operations
 */
class ConfigError extends Error {
  constructor(message, code, originalError = null) {
    super(message);
    this.name = 'ConfigError';
    this.code = code;
    this.originalError = originalError;
  }
}

export { ConfigError };