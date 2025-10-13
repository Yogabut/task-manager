import React, { useState, useEffect } from 'react';
import api, { UserDTO } from '@/lib/api';
import type { AuthContextType } from './authTypes';
import AuthContext from './AuthContext';
import type { User } from '@/lib/mockData';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState<boolean>(!!token);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!token) {
        if (mounted) setIsLoading(false);
        return;
      }
      try {
        if (mounted) setIsLoading(true);
        const me = await api.auth.getMe(token);
        if (mounted) {
          // map UserDTO to frontend User
          const mapped: User = {
            id: me._id,
            name: me.name,
            email: me.email,
            password: '',
            role: (me.role as User['role']) || 'member',
            avatar: me.avatar || (me.name ? me.name[0] : 'U'),
            status: 'active',
          };
          setUser(mapped);
          if (mounted) setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch current user', err);
        // Only clear the token for explicit authorization/authentication failures.
        // For network/transient errors, keep the token so a refresh doesn't force login.
  const errObj = err as unknown as Record<string, unknown> | undefined;
  const message = errObj && typeof errObj.message === 'string' ? errObj.message.toLowerCase() : '';
        const isAuthError = /not authenticated|invalid email|invalid token|unauthor|invalid/i.test(message);
        if (isAuthError) {
          localStorage.removeItem('authToken');
          if (mounted) {
            setToken(null);
            setUser(null);
            setIsLoading(false);
          }
        } else {
          // transient/network issue: keep token, clear user for now
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
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
        const mapped: User = {
          id: res._id,
          name: res.name,
          email: res.email,
          password: '',
          role: (res.role as User['role']) || 'member',
          avatar: res.avatar || (res.name ? res.name[0] : 'U'),
          status: 'active',
        };
        setUser(mapped);
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
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
