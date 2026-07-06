import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatList } from './ChatDetails/ChatList.jsx';
import { ChatHeader } from './ChatDetails/ChatHeade.jsx';
import { ChatRoom } from './ChatDetails/ChatRoom.jsx';
import axios from 'axios';
import { API_URLS } from '../config/api';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const withUserId = searchParams.get('with');
    if (withUserId) {
      const fetchUser = async () => {
        try {
          const { data } = await axios.get(`${API_URLS.USERS}/${withUserId}`, { withCredentials: true });
          setSelectedUser(data.user);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, [searchParams]);

  return (
    <div className="chat-container flex h-screen bg-chat-bg">
      <div className="chat-list w-1/3 border-r border-border bg-parchment">
        <ChatList onSelectUser={setSelectedUser} />
      </div>
      <div className="chat-main flex-1 flex flex-col">
        <div className="chat-header p-5 border-b border-border bg-parchment flex-shrink-0">
          <ChatHeader selectedUser={selectedUser} />
        </div>
        <div className="chat-messages flex-1 overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth">
          <ChatRoom selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
};

export default Chat;