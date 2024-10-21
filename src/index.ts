import * as http from 'http';
import * as dotenv from 'dotenv';
import * as url from 'url';
import { HTTP_STATUS_CODES } from './constants';
import { handleGetRequest } from './requestHandlers/handleGetRequest';

dotenv.config();

// const hostname = '127.0.0.1'
const hostname = 'localhost';
const port = process.env.PORT as unknown as number;

const server = http.createServer((req, res) => {
  // res.statusCode = HTTP_STATUS_CODES.OK
  // res.setHeader('Content-Type', 'text/plain')
  // res.end('Hello, World!')

  const parsedUrl = req.url ? url.parse(req.url, true) : null;
  if (parsedUrl) {
    if (req.method === 'GET') {
      handleGetRequest(req, res, parsedUrl);
    }
  } else {
    // TODO handle errors
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
