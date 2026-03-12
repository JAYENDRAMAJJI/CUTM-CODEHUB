import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'codelearn.auth.user';
const ADMIN_CREDENTIALS = {
  email: 'admin@codelearn.com',
  password: 'Admin@123',
};
const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '')) || 'http://127.0.0.1:8080/api';

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures (privacy mode, disabled storage, quota exceeded).
  }
}

function safeRemoveItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage remove failures.
  }
}

function readPersistedUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = safeGetItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as User;
  } catch {
    safeRemoveItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function persistUser(user: User | null): void {
  if (typeof window === 'undefined') {
    return;
  }
  if (!user) {
    safeRemoveItem(AUTH_STORAGE_KEY);
    return;
  }
  safeSetItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readPersistedUser());

  const login = (role: Role) => {
    if (role === 'STUDENT') {
      const studentUser: User = {
        id: '1',
        name: 'Alex Student',
        email: 'alex@example.com',
        role: 'STUDENT',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      };
      setUser(studentUser);
      persistUser(studentUser);
    } else {
      // Enforce dedicated credential flow for admin authentication.
      persistUser(null);
      setUser(null);
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      return { success: false, message: 'Email and password are required.' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
      });

      if (response.ok) {
        const payload = await response.json() as {
          success?: boolean;
          message?: string;
          user?: { id?: string; name?: string; email?: string; role?: string };
        };

        if (payload.success && payload.user) {
          const adminUser: User = {
            id: payload.user.id || '2',
            name: payload.user.name || 'Admin Sarah',
            email: payload.user.email || normalizedEmail,
            role: 'ADMIN',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          };
          setUser(adminUser);
          persistUser(adminUser);
          return { success: true };
        }

        return { success: false, message: payload.message || 'Invalid admin credentials.' };
      }
    } catch {
      // Fall back to local demo credentials when backend is unavailable.
    }

    if (normalizedEmail !== ADMIN_CREDENTIALS.email || normalizedPassword !== ADMIN_CREDENTIALS.password) {
      return { success: false, message: 'Invalid admin credentials.' };
    }

    const adminUser: User = {
      id: '2',
      name: 'Admin Sarah',
      email: 'admin@codelearn.com',
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    };
    setUser(adminUser);
    persistUser(adminUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    persistUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
