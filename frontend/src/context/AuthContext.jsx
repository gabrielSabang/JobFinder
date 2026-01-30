import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});

  const login = (userData) => {
    const data = axios.get()
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/users/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      setUserInfo(null);
      localStorage.removeItem('userInfo');
    }
  };

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;