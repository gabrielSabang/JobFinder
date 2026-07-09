import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks';

const PostSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
    <div className="h-5 bg-parchment rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-parchment rounded w-full mb-2"></div>
    <div className="h-4 bg-parchment rounded w-2/3 mb-4"></div>
    <div className="flex justify-between">
      <div className="h-3 bg-parchment rounded w-1/4"></div>
      <div className="h-3 bg-parchment rounded w-1/6"></div>
    </div>
  </div>
);

const Home = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePosts(page);

  const posts = data?.posts || [];
  const totalPosts = data?.totalPosts || 0;
  const totalPages = Math.max(1, Math.ceil(totalPosts / 9));

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-ink font-playfair">Latest Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => <PostSkeleton key={n} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-ink font-playfair">Latest Posts</h1>
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block">
            <p className="text-red-700">{error.response?.status === 401 ? 'Please log in to view posts' : 'Failed to fetch posts'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-ink font-playfair">Latest Posts</h1>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-16 w-16 text-warm-gray mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3 className="text-xl font-semibold text-ink mb-2">No posts yet</h3>
          <p className="text-warm-gray">Be the first to create a post!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-ink line-clamp-2">{post.title}</h2>
                <p className="text-warm-gray mb-4 line-clamp-3 flex-1">{post.content}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-warm-gray">
                    By <span className="font-medium text-ink">{post.author?.userName || 'Unknown'}</span>
                  </span>
                  <Link
                    to={`/posts/${post._id}`}
                    className="text-sm font-medium text-accent hover:text-accent-light transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="bg-parchment text-warm-gray px-2 py-0.5 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-border rounded-md text-ink hover:bg-parchment disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-ink text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-border rounded-md text-ink hover:bg-parchment disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
