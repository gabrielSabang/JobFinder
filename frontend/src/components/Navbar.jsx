import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <svg
              className="h-8 w-8 text-indigo-500"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
              <line x1="12" y1="12" x2="12" y2="12.01" />
              <path d="M3 13a20 20 0 0 0 18 0" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 ml-3">JobFinder</h1>
          </Link>
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-1 mr-4">
              <Link to="/home" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link to="/contact" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </Link>
            </div>
            {userInfo ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-800 text-sm font-medium">Welcome, {userInfo.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
