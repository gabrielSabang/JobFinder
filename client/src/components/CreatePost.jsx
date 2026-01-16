import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from './api.js';

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const postData = { title, content, tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag) };
            const { data: newPost } = await api.createPost(postData);
            navigate(`/post/${newPost._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="mb-4">
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-4">
                    <textarea placeholder="Write your post content here..." value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2 border rounded-md h-60 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-6">
                    <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">Publish Post</button>
            </form>
        </div>
    );
};

export default CreatePost;