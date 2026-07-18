import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getApiUrl } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'bubbleai_access_token';
const REFRESH_KEY = 'bubbleai_refresh_token';
const USER_KEY = 'bubbleai_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem(REFRESH_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBase = getApiUrl();

  // Setup axios interceptor for auth headers
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  // Setup axios response interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && localStorage.getItem(REFRESH_KEY)) {
          originalRequest._retry = true;

          try {
            const res = await axios.post(`${apiBase}/auth/refresh`, {
              refreshToken: localStorage.getItem(REFRESH_KEY),
            });

            if (res.data.success) {
              const { accessToken: newAccess, refreshToken: newRefresh } = res.data.data;
              localStorage.setItem(TOKEN_KEY, newAccess);
              localStorage.setItem(REFRESH_KEY, newRefresh);
              setAccessToken(newAccess);
              setRefreshToken(newRefresh);
              originalRequest.headers.Authorization = `Bearer ${newAccess}`;
              return axios(originalRequest);
            }
          } catch {
            // Refresh failed — force logout
            logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [apiBase]);

  // On mount: verify existing token
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${apiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const userData = res.data.data.user;
          setUser(userData);
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
        } else {
          logout();
        }
      } catch {
        // Token might be expired — try refresh
        const rt = localStorage.getItem(REFRESH_KEY);
        if (rt) {
          try {
            const refreshRes = await axios.post(`${apiBase}/auth/refresh`, { refreshToken: rt });
            if (refreshRes.data.success) {
              const { accessToken: newAccess, refreshToken: newRefresh } = refreshRes.data.data;
              localStorage.setItem(TOKEN_KEY, newAccess);
              localStorage.setItem(REFRESH_KEY, newRefresh);
              setAccessToken(newAccess);
              setRefreshToken(newRefresh);

              const meRes = await axios.get(`${apiBase}/auth/me`, {
                headers: { Authorization: `Bearer ${newAccess}` },
              });
              if (meRes.data.success) {
                const userData = meRes.data.data.user;
                setUser(userData);
                localStorage.setItem(USER_KEY, JSON.stringify(userData));
              }
            } else {
              logout();
            }
          } catch {
            logout();
          }
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await axios.post(`${apiBase}/auth/login`, { email, password });

      if (res.data.success) {
        const { user: userData, accessToken: at, refreshToken: rt } = res.data.data;
        setUser(userData);
        setAccessToken(at);
        setRefreshToken(rt);
        localStorage.setItem(TOKEN_KEY, at);
        localStorage.setItem(REFRESH_KEY, rt);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        return { success: true };
      }

      return { success: false, error: res.data.error || 'Login failed.' };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, [apiBase]);

  const register = useCallback(async (email, password, name) => {
    setError(null);
    try {
      const res = await axios.post(`${apiBase}/auth/register`, { email, password, name });

      if (res.data.success) {
        // Auto-login after registration
        return await login(email, password);
      }

      return { success: false, error: res.data.error || 'Registration failed.' };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, [apiBase, login]);

  const logout = useCallback(async () => {
    const rt = localStorage.getItem(REFRESH_KEY);

    // Try to invalidate on server (fire-and-forget)
    if (rt) {
      try {
        await axios.post(`${apiBase}/auth/logout`, { refreshToken: rt });
      } catch { /* ignore */ }
    }

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setError(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }, [apiBase]);

  const updateProfile = useCallback(async (data) => {
    try {
      const res = await axios.put(`${apiBase}/auth/update-profile`, data);
      if (res.data.success) {
        const updatedUser = res.data.data.user;
        setUser(updatedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        return { success: true };
      }
      return { success: false, error: res.data.error };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Update failed.' };
    }
  }, [apiBase]);

  const value = {
    user,
    accessToken,
    loading,
    error,
    isAuthenticated: !!user && !!accessToken,
    login,
    register,
    logout,
    updateProfile,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
