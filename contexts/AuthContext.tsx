import React, { createContext, useState, useEffect, useContext } from 'react';

// Define types locally as we are no longer using Supabase types
export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface Session {
  user: User;
}

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedSession = localStorage.getItem('oasis_session');
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch (error) {
        console.error('Error parsing session:', error);
        localStorage.removeItem('oasis_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Connect to the MERN backend (backend/server.js running on port 3000)
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      // Expecting { user: { id: "...", email: "..." } } from backend
      const newSession: Session = { user: data.user };
      
      setSession(newSession);
      localStorage.setItem('oasis_session', JSON.stringify(newSession));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setSession(null);
    localStorage.removeItem('oasis_session');
  };

  const value = {
    session,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};