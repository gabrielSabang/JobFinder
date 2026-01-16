import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from './api.js';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const { data } = await api.fetchPosts();
                setPosts(data);
            } catch (err) {
                setError('Failed to fetch posts.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getPosts();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading posts...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Recent Posts</h1>
            <div className="space-y-6">
                {posts.length > 0 ? posts.map(post => (
                    <div key={post._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h2 className="text-2xl font-bold mb-2">
                            <Link to={`/post/${post._id}`} className="text-blue-600 hover:underline">{post.title}</Link>
                        </h2>
                        <p className="text-gray-700 mb-4">{post.content.substring(0, 150)}...</p>
                        <p className="text-sm text-gray-500">By {post.author?.userName || 'Unknown'}</p>
                    </div>
                )) : <p>No posts found.</p>}
            </div>
        </div>
    );
};

export default Home;