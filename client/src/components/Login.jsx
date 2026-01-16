import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.jsx';
import * as api from './api.js';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.login({ email, password });
            localStorage.setItem('token', data.token);
            const decodedUser = jwtDecode(data.token);
            setUser(decodedUser);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="mb-4">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-6">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">Login</button>
                <p className="text-center mt-4 text-sm">Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link></p>
            </form>
        </div>
    );
};

export default Login;