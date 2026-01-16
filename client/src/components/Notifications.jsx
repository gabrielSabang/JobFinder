import React, { useState, useEffect } from 'react';
import * as api from './api.js';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                
                const mockData = [
                    { _id: '1', message: 'Someone commented on your post "React Best Practices".' },
                    { _id: '2', message: 'Your application for "Frontend Developer" was viewed.' },
                ];
                setNotifications(mockData);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setLoading(false);
            }
        };
        getNotifications();
    }, []);

    if (loading) return <div className="text-center">Loading notifications...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Notifications</h1>
            <div className="space-y-4">
                {notifications.length > 0 ? notifications.map(notif => (
                    <div key={notif._id} className="bg-white p-4 rounded-lg shadow-md">
                        <p className="text-gray-800">{notif.message}</p>
                    </div>
                )) : <p>No new notifications.</p>}
            </div>
        </div>
    );
};

export default Notifications;