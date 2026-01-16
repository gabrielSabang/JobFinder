import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.jsx';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">JobFinder</Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          {user ? (
            <>
              <Link to="/create-post" className="text-gray-600 hover:text-gray-900">New Post</Link>
              <Link to="/notifications" className="text-gray-600 hover:text-gray-900">Notifications</Link>
              <Link to="/messaging" className="text-gray-600 hover:text-gray-900">Messaging</Link>
              <div className="flex items-center space-x-4">
                <span className="text-gray-800">Welcome, {user.userName || user.name}</span>
                <button onClick={handleLogout} className="text-blue-500 hover:underline">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
              <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;