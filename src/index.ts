import * as http from 'http';
import * as dotenv from 'dotenv';
import * as url from 'url';

import { handleGetRequest } from './requestHandlers/handleGetRequest';
import { handlePostRequest } from './requestHandlers/handlePostRequests';
import { handlePutRequest } from './requestHandlers/handlePutRequests';
import { handleDeleteRequest } from './requestHandlers/handleDeleteRequest';

import { CONTENT_TYPE_JSON, ERROR_MESSAGES, HTTP_STATUS_CODES } from './constants';
import { sendResponse } from './helpers/common';

dotenv.config();

const hostname = 'localhost';
const port = process.env.PORT as unknown as number;

const server = http.createServer((req, res) => {
  const parsedUrl = req.url ? url.parse(req.url, true) : null;

  try {
    if (parsedUrl) {
      if (req.method === 'GET') {
        handleGetRequest(req, res, parsedUrl);
      } else if (req.method === 'POST') {
        handlePostRequest(req, res, parsedUrl);
      } else if (req.method === 'PUT') {
        handlePutRequest(req, res, parsedUrl);
      } else if (req.method === 'DELETE') {
        handleDeleteRequest(req, res, parsedUrl);
      }
    } else {
      throw new Error();
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, CONTENT_TYPE_JSON, { error: ERROR_MESSAGES.SERVER_ERROR });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
