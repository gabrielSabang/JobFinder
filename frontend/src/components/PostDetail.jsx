import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../config/api';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Assuming there's an endpoint to get a single post, e.g., /api/posts/:id
        const { data } = await axios.get(`${API_URLS.POSTS}/${id}`, { withCredentials: true });
        setPost(data.post);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please log in to view this post');
        } else {
          setError('Failed to fetch post');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!post) return <div className="text-center py-8">Post not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-4">By {post.author?.userName || 'Unknown'}</p>
      <div className="prose">{post.content}</div>
      {post.tags && <p className="mt-4 text-sm text-gray-500">Tags: {post.tags.join(', ')}</p>}
      {post.author && (
        <button
          onClick={() => navigate(`/chat?with=${post.author._id}`)}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Message {post.author.userName}
        </button>
      )}
    </div>
  );
};

export default PostDetail;