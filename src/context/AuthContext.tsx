// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { getToken, saveToken, clearToken } from "../lib/storage";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getToken());

  // 🔁 Restore user if token exists
  useEffect(() => {
    const t = getToken();
    if (t) fetchUser(t);
  }, []);

  const fetchUser = async (t: string) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/me", {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setToken(t);
        saveToken(t);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  const login = async (t: string) => {
    await fetchUser(t);
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
