import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../interfaces';

const filePath = 'src/database/users.json';

export const validatePayload = (payload: Record<string, unknown>): boolean => {
  const { username, age, hobbies } = payload;

  if (Object.keys(payload).length !== 3) {
    return false;
  }

  if (typeof username !== 'string') {
    return false;
  }

  if (typeof age !== 'number') {
    return false;
  }

  if (!Array.isArray(hobbies) || hobbies.some(hobby => typeof hobby !== 'string')) {
    return false;
  }

  return true;
};

export const getUsersFromLocalDatabase = async () => {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

export const writeUsersToDatabase = async (users: IUser[]) => {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
};

export const createUser = async ({ username, age, hobbies }: { username: string; age: number; hobbies: string[] }): Promise<IUser> => {
  const existingUsers = await getUsersFromLocalDatabase();
  const newUser = { id: uuidv4(), username, age, hobbies };
  existingUsers.push(newUser);
  await writeUsersToDatabase(existingUsers);
  return newUser;
};

export const updateUser = async ({ id, username, age, hobbies }: IUser): Promise<IUser | null> => {
  const users: IUser[] = await getUsersFromLocalDatabase();
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], username, age, hobbies };
    await writeUsersToDatabase(users);
    return users[userIndex];
  }
  return null;
};
