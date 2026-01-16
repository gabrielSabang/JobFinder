import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from './UserContext.jsx';
import * as api from './api.js';

const PostPage = () => {
    const { postId } = useParams();
    const { user } = useContext(UserContext);
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPost = async () => {
            try {
                const { data } = await api.fetchPost(postId);
                setPost(data);
            } catch (err) {
                setError('Failed to fetch post.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getPost();
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const { data: updatedPost } = await api.commentOnPost(postId, newComment);
            setPost(updatedPost);
            setNewComment('');
        } catch (err) {
            console.error('Failed to post comment', err);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error || !post) return <div className="text-center mt-10 text-red-500">{error || 'Post not found.'}</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-6">By {post.author?.userName || 'Unknown'}</p>
            <div className="prose max-w-none mb-8 text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }}></div>

            <div className="border-t pt-6">
                <h3 className="text-2xl font-bold mb-4">Comments ({post.comments.length})</h3>
                <div className="space-y-4 mb-6">
                    {post.comments.map(comment => (
                        <div key={comment._id} className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-800">{comment.content}</p>
                            <p className="text-xs text-gray-600 mt-1">- {comment.author?.userName || 'Anonymous'}</p>
                        </div>
                    ))}
                </div>
                {user && (
                    <form onSubmit={handleCommentSubmit}>
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
                        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Post Comment</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PostPage;