import React from 'react';

const Messaging = () => {
  // This is a placeholder component. A full messaging system would be more complex.
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden h-[70vh] flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <div className="p-4 hover:bg-gray-100 cursor-pointer">
          <p className="font-semibold">John Doe</p>
          <p className="text-sm text-gray-600 truncate">Hey, are you available for an interview?</p>
        </div>
      </div>
      {/* Chat Window */}
      <div className="w-2/3 flex flex-col justify-center items-center text-gray-500">
        <p>Select a conversation to start messaging.</p>
      </div>
    </div>
  );
};

export default Messaging;