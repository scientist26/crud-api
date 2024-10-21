import { ServerResponse } from 'http';

export const sendResponse = (res: ServerResponse, statusCode: number, contentType: string, data: unknown) => {
  res.writeHead(statusCode, contentType);
  res.end(JSON.stringify(data));
};
