import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import { loadStorage, saveStorage, StorageSchema } from './db';
import { User, RecordItem } from './models';

const app = express();
app.use(cors());
app.use(express.json());

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

app.post('/api/login', async (req: Request, res: Response) => {
  const { userId, password, role } = req.body as { userId: string; password: string; role: string };
  const data = await loadStorage();
  const user = data.users.find(u => u.id === userId && u.password === password && u.role === role);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials or role' });
  }

  const payload = { id: user.id, name: user.name, role: user.role };
  res.json({ user: payload, token: `dummy-${Date.now()}` });
});

app.get('/api/records', async (req: Request, res: Response) => {
  const delayMs = parseInt(req.query.delay as string) || 0;
  const userId = String(req.query.userId || '');
  const role = String(req.query.role || '');
  await delay(delayMs);

  const data = await loadStorage();
  let records = data.records.filter(record => record.ownerId === userId);
  if (role === 'Admin') {
    records = data.records;
  }

  const response = records.map(record => ({
    ...record,
    visibleTo: role === 'Admin' ? 'Admin & General' : 'General'
  }));

  res.json({ records: response });
});

app.get('/api/users', async (req: Request, res: Response) => {
  const delayMs = parseInt(req.query.delay as string) || 0;
  await delay(delayMs);
  const data = await loadStorage();
  const users = data.users.map(({ password, ...rest }) => rest);
  res.json({ users });
});

app.post('/api/users', async (req: Request, res: Response) => {
  const newUser = req.body as User;
  const data = await loadStorage();
  if (data.users.find(u => u.id === newUser.id)) {
    return res.status(400).json({ message: 'User ID already exists' });
  }
  data.users.push(newUser);
  await saveStorage(data);
  res.json({ user: { id: newUser.id, name: newUser.name, role: newUser.role } });
});

app.put('/api/users/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const updates = req.body as Partial<User>;
  const data = await loadStorage();
  const userIndex = data.users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  data.users[userIndex] = { ...data.users[userIndex], ...updates };
  await saveStorage(data);
  const { password, ...rest } = data.users[userIndex];
  res.json({ user: rest });
});

app.delete('/api/users/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = await loadStorage();
  data.users = data.users.filter(user => user.id !== id);
  await saveStorage(data);
  res.json({ success: true });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
