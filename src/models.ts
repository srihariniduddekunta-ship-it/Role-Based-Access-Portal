export interface User {
  id: string;
  name: string;
  password: string;
  role: 'General User' | 'Admin';
}

export interface RecordItem {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  accessLevel: string;
}
