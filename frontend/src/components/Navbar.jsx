import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/users?q=${encodeURIComponent(searchQuery)}`,
          { withCredentials: true }
        );
        setSearchResults(data.users || []);
        setIsDropdownOpen(data.users && data.users.length > 0);
      } catch (error) {
        console.error('Search failed:', error.response?.data || error.message);
        setSearchResults([]);
        setIsDropdownOpen(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserClick = () => {
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setIsDropdownOpen(false);
    }
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
            {userInfo ? (
              <div className="flex items-center">
                <div className="hidden md:flex items-center space-x-1 mr-4">
                  <Link to="/home" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </Link>
                  <Link to="/chats" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Messages
                  </Link>
                </div>
                <form onSubmit={handleSearchSubmit} ref={searchContainerRef} className="hidden md:flex items-center mr-4 relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {searchResults.length > 0 ? (
                          searchResults.map((user) => (
                            <Link
                              key={user._id}
                              to={`/users/${user._id}`} 
                              onClick={handleUserClick}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              {user.name}
                            </Link>
                          ))
                        ) : (
                          <div className="block px-4 py-2 text-sm text-gray-500">
                            No users found.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </form>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-800 text-sm font-medium">Welcome, {userInfo.userName}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
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
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
