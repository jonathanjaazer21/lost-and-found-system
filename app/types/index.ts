export interface User {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string; // ISO string for SSR compatibility
}

export interface LostItem {
  id: string;
  description: string;
  status: 'unclaimed' | 'claimed';
  mobile_number?: string | null;
  upload_url?: string | null;
  created_at: string; // ISO string for SSR compatibility
}

export interface Receiver {
  id: string;
  emails: string[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}
