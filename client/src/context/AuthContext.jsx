import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/auth.api";
import { userApi } from "../api/user.api";
import { setAccessToken } from "../api/axios";
import { USE_MOCK } from "../constants/config";
import { mockUser } from "../mocks/mockData";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | unauthenticated

  // On mount: try to silently restore a session via the refresh cookie.
  // In mock mode we skip network calls entirely and start logged out,
  // so the login screen is always the real first stop of the demo.
  useEffect(() => {
    if (USE_MOCK) {
      setStatus("unauthenticated");
      return;
    }

    const restoreSession = async () => {
      try {
        const refreshRes = await authApi.refresh();
        setAccessToken(refreshRes.data.accessToken);
        const meRes = await userApi.me();
        setUser(meRes.data);
        setStatus("authenticated");
      } catch (err) {
        setStatus("unauthenticated");
      }
    };
    restoreSession();
  }, []);

  useEffect(() => {
    const onExpire = () => {
      setUser(null);
      setStatus("unauthenticated");
    };
    window.addEventListener("finora:session-expired", onExpire);
    return () => window.removeEventListener("finora:session-expired", onExpire);
  }, []);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    if (USE_MOCK) {
      setAccessToken("mock-token");
      setUser(mockUser);
      setStatus("authenticated");
      return mockUser;
    }
    const res = await authApi.login({ email, password, rememberMe });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    setStatus("authenticated");
    return res.data.user;
  }, []);

  const loginWithGoogle = useCallback(async (idToken) => {
    if (USE_MOCK) {
      // No real Google verification in demo mode — just sign in as the demo user
      // so the flow can be clicked through without any backend/Google setup.
      setAccessToken("mock-token");
      setUser(mockUser);
      setStatus("authenticated");
      return mockUser;
    }
    const res = await authApi.googleLogin(idToken);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    setStatus("authenticated");
    return res.data.user;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    if (USE_MOCK) {
      setAccessToken("mock-token");
      const newUser = { ...mockUser, name, email };
      setUser(newUser);
      setStatus("authenticated");
      return newUser;
    }
    const res = await authApi.register({ name, email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    setStatus("authenticated");
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    if (!USE_MOCK) {
      try {
        await authApi.logout();
      } catch (err) {
        // ignore network errors on logout — clear client state regardless
      }
    }
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, status, login, loginWithGoogle, register, logout, updateUser, isAuthenticated: status === "authenticated" }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
