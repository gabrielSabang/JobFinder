import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URLS } from '../config/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${API_URLS.POSTS}/all`, { withCredentials: true });
        setPosts(data.posts);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please log in to view posts');
        } else {
          setError('Failed to fetch posts');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const fetchSearchResults = async () => {
      setIsSearching(true);
      try {
        const { data } = await axios.get(
          `${API_URLS.POSTS}/search?q=${encodeURIComponent(searchQuery)}`,
          { withCredentials: true }
        );
        setSearchResults(data.posts || []);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error('Search failed:', err);
        }
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const displayedPosts = searchQuery ? searchResults : posts;

  if (loading) return <div className="text-center py-8">Loading posts...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Latest Posts</h1>
      
      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {searchQuery && isSearching && <p className="text-center">Searching...</p>}
      
      {searchQuery && !isSearching && displayedPosts.length === 0 && (
        <p className="text-center text-gray-500">No posts found for "{searchQuery}".</p>
      )}
      
      {!searchQuery && posts.length === 0 && (
        <p className="text-center text-gray-500">No posts available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPosts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">{post.title}</h2>
            <p className="text-gray-600 mb-3 line-clamp-3">{post.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">By {post.author?.userName || 'Unknown'}</span>
              <Link
                to={`/posts/${post._id}`}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Read more
              </Link>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
