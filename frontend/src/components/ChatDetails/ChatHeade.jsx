import React from 'react';

export const ChatHeader = ({ selectedUser }) => {
  return (
    <div className="chat-header p-4 border-b bg-gray-100">
      {selectedUser ? (
        <h2 className="text-lg font-semibold">{selectedUser.userName}</h2>
      ) : (
        <h2 className="text-lg font-semibold">Select a chat</h2>
      )}
    </div>
  );
};
