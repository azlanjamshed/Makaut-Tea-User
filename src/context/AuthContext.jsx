import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('rant_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('rant_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Sync token and user to localStorage
  const saveSession = (newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('rant_token', newToken);
    } else {
      localStorage.removeItem('rant_token');
    }
    if (newUser) {
      localStorage.setItem('rant_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('rant_user');
    }
  };

  const logout = useCallback(() => {
    saveSession(null, null);
    authApi.logout().catch(() => {});
  }, []);

  // Fetch fresh profile on boot if token exists
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('rant_token');
    if (!currentToken) {
      setIsLoading(false);
      return null;
    }

    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('rant_user', JSON.stringify(res.data));
        return res.data;
      }
    } catch (err) {
      // If unauthorized, clear invalid token
      if (err.status === 401) {
        saveSession(null, null);
      }
    } finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  useEffect(() => {
    refreshUser();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [refreshUser, logout]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.success && res.token && res.data) {
      saveSession(res.data, res.token);
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    if (res.success && res.token && res.data) {
      saveSession(res.data, res.token);
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const loginWithGoogle = async (payload) => {
    const res = await authApi.googleLogin(payload);
    if (res.success && res.token && res.data) {
      saveSession(res.data, res.token);
      return res;
    }
    throw new Error(res.message || 'Google authentication failed');
  };

  const submitOnboarding = async (onboardingData) => {
    const res = await authApi.completeOnboarding(onboardingData);
    if (res.success && res.data) {
      updateUserState(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Failed to complete profile');
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('rant_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        register,
        loginWithGoogle,
        submitOnboarding,
        logout,
        refreshUser,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
