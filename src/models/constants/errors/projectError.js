import { BASE_ERROR_TYPE, ERROR_DOMAIN, createErrorCode, createErrorMessage } from './baseErrors.js';

/**
 * Project Error Constants
 * Defines the available profile error constants and their corresponding values
 */
const PROJECT_ERROR = Object.freeze({
  NOT_FOUND: createErrorCode(ERROR_DOMAIN.PROJECT, BASE_ERROR_TYPE.NOT_FOUND),
  EMPTY_NAME: createErrorCode(ERROR_DOMAIN.PROJECT, BASE_ERROR_TYPE.EMPTY_REQUIRED_FIELD),
  ALREADY_EXISTS: createErrorCode(ERROR_DOMAIN.PROJECT, BASE_ERROR_TYPE.ALREADY_EXISTS),
  EMPTY_PATH: createErrorCode(ERROR_DOMAIN.PROJECT, BASE_ERROR_TYPE.EMPTY_REQUIRED_FIELD),
  INVALID_PATH: createErrorCode(ERROR_DOMAIN.PROJECT, BASE_ERROR_TYPE.INVALID_VALUE)
});

/**
 * Project Error Messages
 * Project error message descriptions
 */
const PROJECT_ERROR_MESSAGE = Object.freeze({
  [PROJECT_ERROR.NOT_FOUND]: createErrorMessage(BASE_ERROR_TYPE.NOT_FOUND, { resource: "Project" }),
  [PROJECT_ERROR.EMPTY_NAME]: createErrorMessage(BASE_ERROR_TYPE.EMPTY_REQUIRED_FIELD, { field: "Project name" }),
  [PROJECT_ERROR.ALREADY_EXISTS]: createErrorMessage(BASE_ERROR_TYPE.ALREADY_EXISTS, { resource: "Project" }),
  [PROJECT_ERROR.EMPTY_PATH]: createErrorMessage(BASE_ERROR_TYPE.EMPTY_REQUIRED_FIELD, { field: "Project path" }),
  [PROJECT_ERROR.INVALID_PATH]: createErrorMessage(BASE_ERROR_TYPE.INVALID_VALUE, { field: "project path" }),
});

export {
  PROJECT_ERROR,
  PROJECT_ERROR_MESSAGE
};
