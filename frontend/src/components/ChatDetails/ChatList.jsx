import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext.jsx';
import { API_URLS } from '../../config/api';

export const ChatList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${API_URLS.USERS}`, {
          withCredentials: true,
        });
        // Filter out current user
        setUsers(data.users.filter(user => user._id !== userInfo._id));
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('Error fetching users:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchUsers();
    }
  }, [userInfo]);

  if (loading) return <div className="p-4 text-ink">Loading...</div>;

  return (
    <div className="chat-list p-4">
      <h2 className="text-xl font-bold text-ink mb-4 font-playfair">Chats</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user._id} onClick={() => onSelectUser(user)} className="cursor-pointer p-3 hover:bg-cream rounded-lg text-ink">
            {user.userName}
          </li>
        ))}
      </ul>
    </div>
  );
};
