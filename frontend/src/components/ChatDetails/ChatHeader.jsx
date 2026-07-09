import React from 'react';
import { UserAvatar } from './ChatList.jsx';

export const ChatHeader = ({ selectedUser }) => {
  return (
    <div className="flex items-center gap-3">
      {selectedUser ? (
        <>
          <UserAvatar userName={selectedUser.userName} size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-ink">{selectedUser.userName}</h2>
            <p className="text-sm text-warm-gray">{selectedUser.email}</p>
          </div>
        </>
      ) : (
        <h2 className="text-lg font-semibold text-warm-gray">Select a user to start chatting</h2>
      )}
    </div>
  );
};
