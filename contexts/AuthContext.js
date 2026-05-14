import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { fetchUserProfile, refreshAccessToken } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = useCallback(async () => {
    try {
      const profile = await fetchUserProfile();
      if (profile) {
        setUser(profile);
        // Update optimistic cache
        Cookies.set('cryptmorrow_user', JSON.stringify(profile), { expires: 7, path: '/' });
      } else {
        setUser(null);
        Cookies.remove('cryptmorrow_user', { path: '/' });
      }
    } catch (e) {
      console.error("Profile sync failed:", e);
      // Don't clear user here if we have a stale one, just let it be stale until next retry
      // but if we got a 401, fetchUserProfile would have cleared tokens.
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = Cookies.get('cryptmorrow_access_token');
      const refreshToken = Cookies.get('cryptmorrow_refresh_token');
      const cachedUser = Cookies.get('cryptmorrow_user');

      // Optimistic set from cache for immediate speed
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch (e) {
          Cookies.remove('cryptmorrow_user', { path: '/' });
        }
      }

      if (accessToken) {
        await syncProfile();
      } else if (refreshToken) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          await syncProfile();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [syncProfile]);

  const login = async (userData, accessToken, refreshToken) => {
    const options = { expires: 7, path: '/' };
    // Optimistic set
    setUser(userData);
    Cookies.set('cryptmorrow_user', JSON.stringify(userData), options);
    Cookies.set('cryptmorrow_access_token', accessToken, options);
    if(refreshToken) Cookies.set('cryptmorrow_refresh_token', refreshToken, options);
    
    // Background sync to ensure data is absolute source of truth
    await syncProfile();
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('cryptmorrow_user', { path: '/' });
    Cookies.remove('cryptmorrow_access_token', { path: '/' });
    Cookies.remove('cryptmorrow_refresh_token', { path: '/' });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, syncProfile, login, logout, isLoading: loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
