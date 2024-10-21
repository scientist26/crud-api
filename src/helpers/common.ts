import { ServerResponse } from 'http';

export const sendResponse = (res: ServerResponse, statusCode: number, contentType: string, data?: unknown) => {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
  });
  if (data) {
    res.end(JSON.stringify(data));
  } else {
    res.end();
  }
};
