import { promises as fs } from 'fs';
import { join } from 'path';
import { RecordItem, User } from './models';

const storagePath = join(__dirname, '..', 'storage.json');

export interface StorageSchema {
  users: User[];
  records: RecordItem[];
}

const defaultData: StorageSchema = {
  users: [
    { id: 'alice', name: 'Alice Green', password: 'password1', role: 'General User' },
    { id: 'bob', name: 'Bob Clark', password: 'password2', role: 'Admin' }
  ],
  records: [
    { id: 'r1', ownerId: 'alice', title: 'Device Check', description: 'User-level device status details', accessLevel: 'General' },
    { id: 'r2', ownerId: 'alice', title: 'Session Summary', description: 'Daily session analytics for Alice', accessLevel: 'General' },
    { id: 'r3', ownerId: 'bob', title: 'Admin Audit', description: 'Administrative audit log and controls', accessLevel: 'Admin' }
  ]
};

export async function loadStorage(): Promise<StorageSchema> {
  try {
    const body = await fs.readFile(storagePath, 'utf8');
    return JSON.parse(body) as StorageSchema;
  } catch {
    await saveStorage(defaultData);
    return defaultData;
  }
}

export async function saveStorage(data: StorageSchema): Promise<void> {
  await fs.writeFile(storagePath, JSON.stringify(data, null, 2), 'utf8');
}
