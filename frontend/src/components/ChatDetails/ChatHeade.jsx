import React from 'react';

export const ChatHeader = ({ selectedUser }) => {
  return (
    <div className="chat-header">
      {selectedUser ? (
        <h2 className="text-lg font-semibold text-ink">{selectedUser.userName}</h2>
      ) : (
        <h2 className="text-lg font-semibold text-warm-gray">Select a chat</h2>
      )}
    </div>
  );
};
