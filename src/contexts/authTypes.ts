import { User } from '@/lib/mockData';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
}
