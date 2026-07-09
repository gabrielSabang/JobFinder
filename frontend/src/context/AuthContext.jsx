import { createContext, useState, useEffect } from 'react';
import api from '../config/axios';
import { API_URLS } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (loginResponse) => {
    setUserInfo(loginResponse.user || null);
  };

  const logout = async () => {
    try {
      await api.post(`${API_URLS.USERS}/logout`, {});
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      setUserInfo(null);
    }
  };

    useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data } = await api.get(`${API_URLS.USERS}/me`);
        setUserInfo(data.user);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('Failed to check user status:', error);
        }
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
 
    checkUserStatus();
  }, []);

 
  return (
    <AuthContext.Provider value={{ userInfo, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
