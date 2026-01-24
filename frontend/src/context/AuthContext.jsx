import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  const login = (userData) => {
    setUserInfo(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // We call the backend to clear the httpOnly cookie
      await fetch('/api/users/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      // We clear the frontend state regardless of backend call success
      setUserInfo(null);
      localStorage.removeItem('userInfo');
    }
  };

  // On initial load, check localStorage for user info
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