import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Timestamp;
}

export interface LostItem {
  id: string;
  description: string;
  status: 'unclaimed' | 'claimed';
  mobile_number?: string;
  upload_url?: string;
  created_at: Timestamp;
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
