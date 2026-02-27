import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URLS } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  const login = async (loginResponse) => {
    setUserInfo(loginResponse.user);
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URLS.USERS}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      setUserInfo(null);
    }
  };

    useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data } = await axios.get(`${API_URLS.USERS}/me`, {
          withCredentials: true,
        });
        setUserInfo(data.user);
      } catch (error) {
        // Only log actual errors, not 401 unauthorized (expected when not logged in)
        if (error.response?.status !== 401) {
          console.error('Failed to check user status:', error);
        }
        setUserInfo(null);
      }
    };
 
    checkUserStatus();
  }, []);

 
  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;