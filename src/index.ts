import * as http from 'http';
import * as dotenv from 'dotenv';
import * as url from 'url';
import { handleGetRequest } from './requestHandlers/handleGetRequest';
import { handlePostRequest } from './requestHandlers/handlePostRequests';

dotenv.config();

// const hostname = '127.0.0.1'
const hostname = 'localhost';
const port = process.env.PORT as unknown as number;

const server = http.createServer((req, res) => {
  const parsedUrl = req.url ? url.parse(req.url, true) : null;
  if (parsedUrl) {
    if (req.method === 'GET') {
      handleGetRequest(req, res, parsedUrl);
    } else if (req.method === 'POST') {
      handlePostRequest(req, res, parsedUrl);
    }
  } else {
    // TODO handle errors
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
