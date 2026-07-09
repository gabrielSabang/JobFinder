import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatList } from './ChatDetails/ChatList.jsx';
import { ChatHeader } from './ChatDetails/ChatHeader.jsx';
import { ChatRoom } from './ChatDetails/ChatRoom.jsx';
import api from '../config/axios';
import { API_URLS } from '../config/api';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const withUserId = searchParams.get('with');
    if (withUserId) {
      const fetchUser = async () => {
        try {
          const { data } = await api.get(`${API_URLS.USERS}/${withUserId}`);
          setSelectedUser(data.user);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, [searchParams]);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-chat-bg">
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-border bg-parchment overflow-y-auto">
        <ChatList onSelectUser={setSelectedUser} />
      </div>
      <div className="hidden md:flex flex-1 flex-col">
        <div className="p-5 border-b border-border bg-parchment flex-shrink-0">
          <ChatHeader selectedUser={selectedUser} />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col">
          <ChatRoom selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
