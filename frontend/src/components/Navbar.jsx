import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { API_URLS } from '../config/api';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
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
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `${API_URLS.USERS}?q=${encodeURIComponent(searchQuery)}`,
          { withCredentials: true }
        );
        setSearchResults(data.users || []);
        setIsDropdownOpen(data.users && data.users.length > 0);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('Search failed:', error.response?.data || error.message);
        }
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
    setIsDropdownOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [location.pathname]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsDropdownOpen(false);
    }
  };

  return (
    <nav className="bg-parchment border-b border-border px-4 sm:px-6 lg:px-10 min-h-16 flex flex-wrap items-center justify-between gap-3 py-3 sticky top-0 z-50">
      <Link to="/" className="flex items-center shrink-0">
        <svg
          className="h-8 w-8 text-accent"
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
        <h1 className="text-2xl font-bold text-ink ml-3 font-playfair">JobFinder</h1>
      </Link>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
            {userInfo ? (
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex flex-wrap items-center gap-1">
                  <NavLink to="/home" className={({isActive}) => isActive ? 'text-accent px-3 py-2 rounded-md text-sm font-medium' : 'text-warm-gray hover:text-accent px-3 py-2 rounded-md text-sm font-medium'}>
                    Home
                  </NavLink>
                  <NavLink to="/chat" className={({isActive}) => isActive ? 'text-accent px-3 py-2 rounded-md text-sm font-medium' : 'text-warm-gray hover:text-accent px-3 py-2 rounded-md text-sm font-medium'}>
                    Messages
                  </NavLink>
                </div>
                <form onSubmit={handleSearchSubmit} ref={searchContainerRef} className="flex items-center relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim() === '') {
                        setSearchResults([]);
                        setIsDropdownOpen(false);
                      }
                    }}
                    className="block w-full rounded-md border border-border py-1.5 text-ink shadow-sm placeholder:text-warm-gray focus:ring-2 focus:ring-accent focus:border-accent sm:text-sm"
                  />
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-2 w-full rounded-md shadow-custom bg-parchment ring-1 ring-border z-10">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {searchResults.length > 0 ? (
                          searchResults.map((user) => (
                            <Link
                              key={user._id}
                              to={`/users/${user.userName}`}
                              onClick={() => setIsDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-ink hover:bg-cream"
                              role="menuitem"
                            >
                              <div className="font-medium">{user.userName}</div>
                              <div className="text-warm-gray">{user.email}</div>
                            </Link>
                          ))
                        ) : (
                          <div className="block px-4 py-2 text-sm text-warm-gray">
                            No users found.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </form>
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-ink text-sm font-medium">Welcome, {userInfo.userName}</span>
                  <button
                    onClick={handleLogout}
                    className="text-warm-gray hover:text-accent px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex flex-wrap items-center gap-1">
                  <NavLink to="/home" className={({isActive}) => isActive ? 'text-accent px-3 py-2 rounded-md text-sm font-medium' : 'text-warm-gray hover:text-accent px-3 py-2 rounded-md text-sm font-medium'}>
                    Home
                  </NavLink>
                  <NavLink to="/about" className={({isActive}) => isActive ? 'text-accent px-3 py-2 rounded-md text-sm font-medium' : 'text-warm-gray hover:text-accent px-3 py-2 rounded-md text-sm font-medium'}>
                    About
                  </NavLink>
                  <NavLink to="/contact" className={({isActive}) => isActive ? 'text-accent px-3 py-2 rounded-md text-sm font-medium' : 'text-warm-gray hover:text-accent px-3 py-2 rounded-md text-sm font-medium'}>
                    Contact
                  </NavLink>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link to="/login" className="text-warm-gray hover:text-accent px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="text-ink bg-accent hover:bg-accent-light px-3 py-2 rounded-md text-sm font-medium">
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
  </nav>
  )
}

export default Navbar
