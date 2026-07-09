import { useParams, useNavigate } from 'react-router-dom';
import { usePost } from '../hooks';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePost(id);

  if (isLoading) return <div className="text-center py-8 text-ink">Loading...</div>;
  if (error) return <div className="text-center py-8 text-accent">{error.response?.status === 401 ? 'Please log in to view this post' : 'Failed to fetch post'}</div>;

  const post = data?.post;
  if (!post) return <div className="text-center py-8 text-warm-gray">Post not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-14 py-14 border-r border-border">
      <h1 className="text-5xl font-bold mb-4 text-ink font-playfair leading-tight tracking-tight">{post.title}</h1>
      <div className="flex items-center gap-3 py-4 border-t border-b border-border mb-9">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-ink font-bold flex-shrink-0">
          {post.author?.userName?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="text-warm-gray">By {post.author?.userName || 'Unknown'}</span>
      </div>
      <div className="text-lg leading-relaxed text-ink max-w-2xl prose">
        {post.content}
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span key={index} className="bg-accent-light text-ink px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
      {post.author && (
        <button
          onClick={() => navigate(`/chat?with=${post.author._id}`)}
          className="mt-6 bg-ink text-cream px-4 py-2 rounded hover:bg-accent transition"
        >
          Message {post.author.userName}
        </button>
      )}
    </div>
  );
};

export default PostDetail;
