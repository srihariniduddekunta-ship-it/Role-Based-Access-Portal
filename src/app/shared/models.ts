export interface UserProfile {
  id: string;
  name: string;
  role: 'General User' | 'Admin';
}

export interface UserLoginPayload {
  userId: string;
  password: string;
  role: 'General User' | 'Admin';
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface UserRecord {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  accessLevel: string;
  visibleTo: string;
}

export interface AppUser extends UserProfile {
  password?: string;
}
