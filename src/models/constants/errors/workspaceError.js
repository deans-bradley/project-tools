import { BASE_ERROR_TYPE, ERROR_DOMAIN, createErrorCode, createErrorMessage } from './baseErrors.js';

/**
 * Workspace Error Constants
 * Defines the available profile error constants and their corresponding values
 */
const WORKSPACE_ERROR = Object.freeze({
  NOT_FOUND: createErrorCode(ERROR_DOMAIN.WORKSPACE, BASE_ERROR_TYPE.NOT_FOUND),
  EMPTY_NAME: createErrorCode(ERROR_DOMAIN.WORKSPACE, BASE_ERROR_TYPE.EMPTY_REQUIRED_FIELD),
  ALREADY_EXISTS: createErrorCode(ERROR_DOMAIN.WORKSPACE, BASE_ERROR_TYPE.ALREADY_EXISTS),
  EMPTY_PATH: createErrorCode(ERROR_DOMAIN.WORKSPACE, BASE_ERROR_TYPE.EMPTY_REQUIRED_FIELD),
  INVALID_PATH: createErrorCode(ERROR_DOMAIN.WORKSPACE, BASE_ERROR_TYPE.INVALID_VALUE)
});

/**
 * Workspace Error Messages
 * Workspace error message descriptions
 */
const WORKSPACE_ERROR_MESSAGE = Object.freeze({
  [WORKSPACE_ERROR.NOT_FOUND]: createErrorMessage(BASE_ERROR_TYPE.NOT_FOUND, { resource: "Workspace" }),
  [WORKSPACE_ERROR.EMPTY_NAME]: createErrorMessage(BASE_ERROR_TYPE.EMPTY_REQUIRED_FIELD, { field: "Workspace name" }),
  [WORKSPACE_ERROR.ALREADY_EXISTS]: createErrorMessage(BASE_ERROR_TYPE.ALREADY_EXISTS, { resource: "Workspace" }),
  [WORKSPACE_ERROR.EMPTY_PATH]: createErrorMessage(BASE_ERROR_TYPE.EMPTY_REQUIRED_FIELD, { field: "Workspace path" }),
  [WORKSPACE_ERROR.INVALID_PATH]: createErrorMessage(BASE_ERROR_TYPE.INVALID_VALUE, { field: "workspace path" }),
});

export {
  WORKSPACE_ERROR,
  WORKSPACE_ERROR_MESSAGE
};
