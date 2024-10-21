import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import { validate as uuidValidate } from 'uuid';

import { CONTENT_TYPE_JSON, ENDPOINTS, HTTP_STATUS_CODES } from '../constants';
import { getUsersFromLocalDatabase } from '../helpers/users';
import { sendResponse } from '../helpers/common';

export const handleGetRequest = async (req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery) => {
  if (!parsedUrl.path) {
    // TODO check
    return sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: 'Invalid request' });
  }

  if (parsedUrl.path === ENDPOINTS.USERS) {
    const users = await getUsersFromLocalDatabase();
    sendResponse(res, HTTP_STATUS_CODES.OK, CONTENT_TYPE_JSON, users);
  } else if (parsedUrl.path.startsWith(ENDPOINTS.USERS)) {
    const userId = parsedUrl.query.id || parsedUrl.path.split('/').pop();
    const users = await getUsersFromLocalDatabase();
    const user = users.find((u: { id: string }) => u.id === userId);

    if (user) {
      sendResponse(res, HTTP_STATUS_CODES.OK, CONTENT_TYPE_JSON, user);
    } else {
      const isUserIdValid = uuidValidate(String(userId));

      if (isUserIdValid) {
        sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, CONTENT_TYPE_JSON, { error: 'User not found' });
      } else {
        sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: 'User id is invalid' });
      }
    }
  } else {
    sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, CONTENT_TYPE_JSON, { error: 'Endpoint not found' });
  }
};
