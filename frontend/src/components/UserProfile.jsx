import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../config/api';

const UserProfile = () => {
  const { userName } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`${API_URLS.USERS}/${userName}`, { withCredentials: true }),
          axios.get(`${API_URLS.POSTS}/user/${userName}`, { withCredentials: true })
        ]);
        setUser(userRes.data.user);
        setPosts(postsRes.data.posts || []);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please log in to view user profiles');
        } else {
          setError('Failed to fetch user data');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [userName]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-600 mb-2">User Not Found</h2>
        <p className="text-gray-500">The user you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user.userName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.userName}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Joined recently
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                  </svg>
                  {posts.length} posts
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Blog Posts</h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-sm text-gray-500">This user hasn't published any blog posts.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link to={`/posts/${post._id}`} className="block">
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors mb-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-3 line-clamp-3">
                        {post.content}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <time dateTime={post.createdAt}>
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;