import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, UserProfile } from '../services/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAppwriteConnected: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  signup: (data: {
    fullName: string;
    email: string;
    password: string;
    propertyName: string;
    propertyType: string;
    unitCount: string;
  }) => Promise<UserProfile>;
  logout: () => Promise<void>;
  quickDemoAccess: () => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to load user session', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const profile = await authService.login(email, password);
    setUser(profile);
    return profile;
  };

  const signup = async (data: {
    fullName: string;
    email: string;
    password: string;
    propertyName: string;
    propertyType: string;
    unitCount: string;
  }) => {
    const profile = await authService.signup(data);
    setUser(profile);
    return profile;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const quickDemoAccess = async () => {
    const profile = await authService.quickDemoLogin();
    setUser(profile);
    return profile;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAppwriteConnected: authService.isConfigured(),
        login,
        signup,
        logout,
        quickDemoAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
