import { useContext } from 'react';
import AuthContext from './AuthContext';
import type { AuthContextType } from './authTypes';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext as React.Context<AuthContextType | undefined>);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default useAuth;
