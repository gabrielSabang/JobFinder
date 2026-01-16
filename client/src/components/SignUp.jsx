import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from './api.js';

const SignUp = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            await api.signUp({ userName, email, password });
            setSuccess('Sign up successful! Please log in.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Sign up failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                <div className="mb-4">
                    <input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-4">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-6">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50">
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
                <p className="text-center mt-4 text-sm">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></p>
            </form>
        </div>
    );
};

export default SignUp;