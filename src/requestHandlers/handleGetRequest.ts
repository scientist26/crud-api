import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import { validate as uuidValidate } from 'uuid';

import { CONTENT_TYPE_JSON, HTTP_STATUS_CODES } from '../constants';
import { getUsersFromLocalDatabase } from '../helpers/users';

const sendResponse = (res: ServerResponse, statusCode: number, contentType: string, data: unknown) => {
  res.writeHead(statusCode, contentType);
  res.end(JSON.stringify(data));
};

export const handleGetRequest = async (req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery) => {
  //   console.log('parsedUrl', parsedUrl);
  if (!parsedUrl.path) {
    // TODO check
    return sendResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, CONTENT_TYPE_JSON, { error: 'Invalid request' });
  }

  if (parsedUrl.path === '/users') {
    const users = await getUsersFromLocalDatabase();
    sendResponse(res, HTTP_STATUS_CODES.OK, CONTENT_TYPE_JSON, users);
  } else if (parsedUrl.path.startsWith('/users')) {
    const userId = parsedUrl.query.id || parseInt(parsedUrl.path.split('/').pop() || '0');
    const users = await getUsersFromLocalDatabase();
    const user = users.find((u: { id: number }) => u.id === userId);
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
  }
  //   if (parsedUrl.path === '/') {
  //     // Return HTML response for the home page
  //     sendResponse(res, 200, CONTENT_TYPE_HTML, `<b>Products <a href = '/product'>list</a> page</b>`);
  //   } else if (parsedUrl.path === '/product') {
  //     // Return JSON response with the list of products
  //     sendResponse(res, 200, CONTENT_TYPE_JSON, products);
  //   } else if (parsedUrl.path.startsWith('/product')) {
  //     // Get product by id. A product can be fetched using path param or query param
  //     const productId = parsedUrl.query.id || parseInt(parsedUrl.path.split('/').pop());
  //     const product = getProductById(productId);

  //     if (product) {
  //       // Return JSON response with the product details
  //       sendResponse(res, 200, CONTENT_TYPE_JSON, product);
  //     } else {
  //       // Return a 404 response if the product is not found
  //       sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'Product not found' });
  //     }
  //   } else {
  //     // Return a 404 response if the endpoint is not found
  //     sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'Endpoint not found' });
  //   }
};

// const getUserById = (userId: number) => {
//   return users.find(p => p.id === userId);
// };
