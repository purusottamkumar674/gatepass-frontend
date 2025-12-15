import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem("tokens");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get("/api/me/");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      if (err.response?.status === 401) logout();
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
