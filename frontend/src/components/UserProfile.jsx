import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserProfile, useUserPosts } from '../hooks';

const UserProfile = () => {
  const { userName } = useParams();
  const [page, setPage] = useState(1);

  const { data: userData, isLoading: userLoading, error: userError } = useUserProfile(userName);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(userName, page);

  const user = userData?.user;
  const posts = postsData?.posts || [];
  const totalPosts = postsData?.totalPosts || 0;
  const totalPages = Math.max(1, Math.ceil(totalPosts / 10));
  const loading = userLoading || postsLoading;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
    </div>
  );
  if (userError) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-accent mb-2">Error</h2>
        <p className="text-warm-gray">{userError.response?.status === 401 ? 'Please log in to view user profiles' : 'Failed to fetch user data'}</p>
      </div>
    </div>
  );
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-warm-gray mb-2">User Not Found</h2>
        <p className="text-warm-gray">The user you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-parchment shadow-custom">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center text-ink text-4xl font-bold">
                {user.userName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-ink mb-2 font-playfair">{user.userName}</h1>
              <p className="text-warm-gray mb-4">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-warm-gray">
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
                  {totalPosts} posts
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-parchment rounded-lg shadow-custom p-6">
          <h2 className="text-2xl font-bold text-ink mb-6 font-playfair">Blog Posts</h2>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-warm-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-ink">No posts yet</h3>
              <p className="mt-1 text-sm text-warm-gray">This user hasn't published any blog posts.</p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {posts.map((post) => (
                  <article key={post._id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link to={`/posts/${post._id}`} className="block">
                          <h3 className="text-xl font-semibold text-ink hover:text-accent transition-colors mb-2">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-warm-gray mb-3 line-clamp-3">
                          {post.content}
                        </p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-light text-ink">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-warm-gray">
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

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border border-border rounded-md text-ink hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-ink text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white border border-border rounded-md text-ink hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
