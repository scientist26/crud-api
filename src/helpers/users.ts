import { promises as fs } from 'fs';
// import { v4 as uuidv4 } from 'uuid';

const filePath = 'src/database/users.json';

export async function getUsersFromLocalDatabase() {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}
