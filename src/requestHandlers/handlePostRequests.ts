import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import { CONTENT_TYPE_JSON, ENDPOINTS, ERROR_MESSAGES, HTTP_STATUS_CODES } from '../constants';
import { sendResponse } from '../helpers/common';
import { createUser, validatePayload } from '../helpers/users';
import { IUser } from '../interfaces';

export const handlePostRequest = async (req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery) => {
  if (!parsedUrl.path) {
    // TODO refactor: move upper or to middleware
    return sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: 'Invalid request' });
  }

  if (parsedUrl.path === ENDPOINTS.USERS) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const parsedBodyData = JSON.parse(body);
        const isDataValid = validatePayload(parsedBodyData);
        if (isDataValid) {
          const newUser = await createUser(parsedBodyData as IUser);
          sendResponse(res, HTTP_STATUS_CODES.CREATED, CONTENT_TYPE_JSON, newUser);
        } else {
          sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.INVALID_REQUEST_PAYLOAD });
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.INVALID_JSON_DATA });
      }
    });
  } else {
    sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.ENDPOINT_NOT_FOUND });
  }
};
