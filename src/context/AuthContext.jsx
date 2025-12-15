import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/axios";

const AuthContext = createContext();

/* ---------- Safe JSON parse ---------- */
function safeParse(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem(key); // corrupted → cleanup
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => safeParse("user"));
  const [tokens, setTokens] = useState(() => safeParse("tokens"));
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get("/api/me/");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (tokenData) => {
    setTokens(tokenData);
    localStorage.setItem("tokens", JSON.stringify(tokenData));
    await fetchMe();
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    setLoading(false);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  };

  useEffect(() => {
    if (tokens) fetchMe();
    else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, tokens, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

