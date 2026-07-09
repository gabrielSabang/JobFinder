import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext.jsx';
import { useUsers } from '../../hooks';

const UserAvatar = ({ userName, size = 'md' }) => {
  const sizeClass = size === 'lg' ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-sm';
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-ink font-bold flex-shrink-0`}>
      {userName?.charAt(0).toUpperCase() || '?'}
    </div>
  );
};

export const ChatList = ({ onSelectUser }) => {
  const { userInfo } = useContext(AuthContext);
  const { data, isLoading } = useUsers();

  const users = (data?.users || []).filter(user => user._id !== userInfo?._id);

  if (isLoading) return <div className="p-4 text-ink">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-ink mb-4 font-playfair">Chats</h2>
      {users.length === 0 ? (
        <p className="text-warm-gray text-sm">No users available</p>
      ) : (
        <ul className="space-y-1">
          {users.map(user => (
            <li
              key={user._id}
              onClick={() => onSelectUser(user)}
              className="flex items-center gap-3 cursor-pointer p-3 hover:bg-cream rounded-lg transition-colors"
            >
              <UserAvatar userName={user.userName} />
              <div>
                <span className="font-medium text-ink">{user.userName}</span>
                <p className="text-xs text-warm-gray">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { UserAvatar };
