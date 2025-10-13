import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { UserDTO } from '@/lib/api';

interface AuthContextType {
  user: UserDTO | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));

  useEffect(() => {
    // If we have a token, fetch user
    let mounted = true;
    const init = async () => {
      if (!token) return;
      try {
        const me = await api.auth.getMe(token);
        if (mounted) setUser(me);
      } catch (err) {
        console.error('Failed to fetch current user', err);
        localStorage.removeItem('authToken');
        if (mounted) {
          setToken(null);
          setUser(null);
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.auth.login({ email, password });
      if (res && res.token) {
        localStorage.setItem('authToken', res.token);
        setToken(res.token);
        setUser(res);
        return true;
      }
    } catch (e) {
      console.error('Login failed', e);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, token }}>
      {children}
    </AuthContext.Provider>
  );
};
