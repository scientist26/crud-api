import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import { validate as uuidValidate } from 'uuid';

import { CONTENT_TYPE_JSON, ENDPOINTS, ERROR_MESSAGES, HTTP_STATUS_CODES } from '../constants';
import { deleteUser, getUsersFromLocalDatabase } from '../helpers/users';
import { sendResponse } from '../helpers/common';
import { IUser } from '../interfaces';

export const handleDeleteRequest = async (req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery) => {
  if (!parsedUrl.path) {
    // TODO refactor: move upper or to middleware
    return sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: 'Invalid request' });
  }

  if (parsedUrl.path.split('/').includes(ENDPOINTS.USERS)) {
    const userId = parsedUrl.query.id || parsedUrl.path.split('/').pop();

    const isUserIdValid = uuidValidate(String(userId));

    if (isUserIdValid) {
      const users = await getUsersFromLocalDatabase();
      const user: IUser | undefined = users.find((u: { id: string }) => u.id === userId);

      if (user) {
        const userId = parsedUrl.query.id || parsedUrl.path.split('/').pop();
        const users = await getUsersFromLocalDatabase();
        const user = users.find((u: { id: string }) => u.id === userId);

        if (user) {
          if (typeof userId === 'string') {
            await deleteUser(userId);
          }
          sendResponse(res, HTTP_STATUS_CODES.NO_CONTENT, CONTENT_TYPE_JSON);
        }
      } else {
        sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.USER_NOT_FOUND });
      }
    } else {
      sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.USER_ID_INVALID });
    }
  } else {
    sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.ENDPOINT_NOT_FOUND });
  }
};
