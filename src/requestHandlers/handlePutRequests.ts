import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import { validate as uuidValidate } from 'uuid';

import { CONTENT_TYPE_JSON, ENDPOINTS, ERROR_MESSAGES, HTTP_STATUS_CODES } from '../constants';
import { sendResponse } from '../helpers/common';
import { getUsersFromLocalDatabase, updateUser, validatePayload } from '../helpers/users';
import { IUser } from '../interfaces';

export const handlePutRequest = async (req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery) => {
  if (!parsedUrl.path) {
    // TODO refactor: move upper or to middleware
    return sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: 'Invalid request' });
  }

  if (parsedUrl.path.startsWith(ENDPOINTS.USERS)) {
    const userId = parsedUrl.query.id || parsedUrl.path.split('/').pop();
    const users = await getUsersFromLocalDatabase();
    const user: IUser | undefined = users.find((u: { id: string }) => u.id === userId);

    if (user) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        // TODO extract validation to middleware
        try {
          const parsedBodyData = JSON.parse(body);
          const isDataValid = validatePayload(parsedBodyData);
          if (isDataValid) {
            const updatedUser = await updateUser({ id: userId, ...parsedBodyData });
            sendResponse(res, HTTP_STATUS_CODES.OK, CONTENT_TYPE_JSON, updatedUser);
          } else {
            sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.INVALID_REQUEST_PAYLOAD });
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.INVALID_JSON_DATA });
        }
      });
    } else {
      const isUserIdValid = uuidValidate(String(userId));

      if (isUserIdValid) {
        sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.USER_NOT_FOUND });
      } else {
        sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.USER_ID_INVALID });
      }
    }
  } else {
    sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.ENDPOINT_NOT_FOUND });
  }
};
