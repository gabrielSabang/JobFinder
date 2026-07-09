import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import AuthContext from '../../context/AuthContext.jsx';
import { useMessages } from '../../hooks';

/* global __API_BASE_URL__ */

export const ChatRoom = ({ selectedUser }) => {
  const { userInfo } = useContext(AuthContext);
  const [newMessage, setNewMessage] = useState('');
  const [page, setPage] = useState(1);
  const [allMessages, setAllMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const { data, isLoading } = useMessages(selectedUser?._id, page);

  const totalMessages = data?.totalMessages || 0;
  const totalPages = Math.max(1, Math.ceil(totalMessages / 50));

  useEffect(() => {
    if (data?.messages) {
      const msgs = data.messages.slice().reverse();
      if (page === 1) {
        setAllMessages(msgs);
      } else {
        setAllMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m._id));
          const newMsgs = msgs.filter((m) => !existingIds.has(m._id));
          return [...newMsgs, ...prev];
        });
      }
    }
  }, [data, page]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!userInfo) return;
    socketRef.current = io(__API_BASE_URL__, { withCredentials: true });
    socketRef.current.emit('join', userInfo._id);

    socketRef.current.on('receiveMessage', (message) => {
      if (message.sender === selectedUser?._id || message.receiver === selectedUser?._id) {
        setAllMessages((prev) => [...prev, message]);
      }
    });

    socketRef.current.on('messageSent', (message) => {
      if (message.sender === userInfo._id && message.receiver === selectedUser?._id) {
        setAllMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userInfo, selectedUser?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      sender: userInfo._id,
      receiver: selectedUser._id,
      content: newMessage,
    };

    socketRef.current?.emit('sendMessage', messageData);
    setNewMessage('');
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((p) => p + 1);
    }
  };

  if (!selectedUser) return <div className="flex items-center justify-center h-full text-warm-gray">Select a user to start chatting</div>;

  return (
    <div className="chat-room flex flex-col h-full">
      <div className="messages flex-1 overflow-y-auto px-4">
        {totalPages > 1 && page < totalPages && (
          <div className="text-center py-2">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="text-sm text-accent hover:text-accent-light disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load older messages'}
            </button>
          </div>
        )}
        {allMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-warm-gray text-sm">
            No messages yet. Say hello!
          </div>
        ) : (
          allMessages.map((msg, index) => (
            <div key={msg._id || index} className={`flex gap-2 mb-3 ${msg.sender === userInfo._id ? 'flex-row-reverse' : ''}`}>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] break-words ${msg.sender === userInfo._id ? 'bg-ink text-cream rounded-br-sm' : 'bg-white text-ink rounded-bl-sm shadow-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 flex gap-2 items-end border-t border-border">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border border-border rounded-xl bg-white text-sm resize-none min-h-11 max-h-30 outline-none focus:border-accent"
          rows="1"
        />
        <button type="submit" className="w-10 h-10 bg-ink border-none rounded-xl cursor-pointer text-cream flex items-center justify-center transition hover:bg-accent hover:scale-105">
          Send
        </button>
      </form>
    </div>
  );
};
