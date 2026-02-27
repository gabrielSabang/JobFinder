import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import AuthContext from '../../context/AuthContext.jsx';

/* global __API_BASE_URL__ */
const socket = io(__API_BASE_URL__, { withCredentials: true });

export const ChatRoom = ({ selectedUser }) => {
  const { userInfo } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (userInfo) {
      socket.emit('join', userInfo._id);
    }
  }, [userInfo]);

  const fetchMessages = useCallback(async () => {
    if (!selectedUser || !userInfo) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:8000/api/messages/${selectedUser._id}`, {
        withCredentials: true,
      });
      setMessages(data.messages);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error fetching messages:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedUser, userInfo]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      sender: userInfo._id,
      receiver: selectedUser._id,
      content: newMessage,
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  if (!selectedUser) return <div>Select a user to start chatting</div>;

  return (
    <div className="chat-room flex flex-col h-full">
      <div className="chat-header p-4 border-b">
        <h1>Chat with {selectedUser.userName}</h1>
      </div>
      <div className="messages flex-1 overflow-y-auto p-4">
        {loading ? (
          <div>Loading messages...</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message mb-2 ${msg.sender === userInfo._id ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded ${msg.sender === userInfo._id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {msg.content}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="message-input p-4 border-t flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Send</button>
      </form>
    </div>
  );
};
