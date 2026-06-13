import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const response = await apiFetch("/auth/me");
      setUser(response.isLoggedIn ? response.user : null);
      return response;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    refreshAuth().finally(() => {
      setLoading(false);
    });
  }, []);

  const login = async (values) => {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    });
    await refreshAuth();
    return response;
  };

  const signup = async (values) => {
    return apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(values),
    });
  };

  const logout = async () => {
    await apiFetch("/auth/logout", {
      method: "POST",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: Boolean(user),
        refreshAuth,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
