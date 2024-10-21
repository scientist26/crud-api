export enum HTTP_STATUS_CODES {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ENDPOINTS {
  USERS = '/users',
  USER = '/user',
}

export enum ERROR_MESSAGES {
  USER_NOT_FOUND = 'User not found',
  USER_ID_INVALID = 'User id is invalid',
  ENDPOINT_NOT_FOUND = 'Endpoint not found',
  INVALID_REQUEST_PAYLOAD = 'Invalid request payload',
  INVALID_JSON_DATA = 'Invalid JSON data',
}

export const CONTENT_TYPE_JSON = 'application/json';
