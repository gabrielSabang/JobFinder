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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="chat-list">
      <h2>Chats</h2>
      <ul>
        {users.map(user => (
          <li key={user._id} onClick={() => onSelectUser(user)} className="cursor-pointer p-2 hover:bg-gray-200">
            {user.userName}
          </li>
        ))}
      </ul>
    </div>
  );
};
