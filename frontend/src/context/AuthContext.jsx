import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  const login = async () => {
    
    const { data } = await axios.get('http://localhost:8000/api/users/me', {
      withCredentials: true,
    });
    
    setUserInfo(data.user);
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/users/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      setUserInfo(null);
    }
  };

    useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/users/me', {
          withCredentials: true,
        });
        setUserInfo(data.user);
      } catch (error) {
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