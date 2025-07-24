import React, { useState } from 'react';

const getAvatar = (chat, userId) => {
  if (chat.isGroupChat) {
    return (
      <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg">
        {chat.name?.[0]?.toUpperCase() || 'G'}
      </div>
    );
  }
  const other = chat.participants.find((u) => u._id !== userId);
  return (
    <img
      src={other?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${other?.email || 'user'}`}
      alt={other?.name || 'User'}
      className="w-10 h-10 rounded-full object-cover"
    />
  );
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatList = ({ chats, onSelectChat, selectedChat }) => {
  const [search, setSearch] = useState('');
  // Parse user info from localStorage and get userId
  let userId = '';
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    userId = user?._id || user?.userId || user?.id || '';
  } catch {
    userId = localStorage.getItem('userId') || '';
  }


  const filteredChats = chats.filter((chat) => {
    if (chat.isGroupChat) return chat.name.toLowerCase().includes(search.toLowerCase());
    const other = chat.participants.find((u) => String(u._id) !== String(userId));
    return other?.username?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="w-1/3 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 bg-gray-800">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chats..."
          className="w-full px-3 py-2 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-700 border border-gray-700"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 && (
          <div className="text-gray-500 text-center mt-8">No chats found</div>
        )}
        {filteredChats.map((chat) => {
          // Always get the other participant for private chats
          let displayName = '';
          let avatarUrl = '';
          let other = null;
          if (chat.isGroupChat) {
            displayName = chat.name;
            avatarUrl = undefined;
          } else {
            // Try to find the other participant
            if (chat.participants.length === 2) {
              other = chat.participants.find((u) => String(u._id) !== String(userId));
            }
            // Fallback: if only one participant, use that
            if (!other && chat.participants.length === 1) {
              other = chat.participants[0];
            }
            displayName = other?.username || other?.name || other?.email || 'User';
            avatarUrl = other?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${other?.email || 'user'}`;
          }
          return (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-800 hover:bg-gray-800 ${
                selectedChat?._id === chat._id ? 'bg-blue-900' : ''
              }`}
            >
              {/* Avatar */}
              {chat.isGroupChat ? (
                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg">
                  {chat.name?.[0]?.toUpperCase() || 'G'}
                </div>
              ) : (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold truncate text-gray-100">
                    {displayName}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {formatTime(chat.updatedAt)}
                  </span>
                </div>
                <div className="text-sm text-gray-400 truncate">
                  {chat.latestMessage?.content
                    ? (chat.latestMessage.content.length > 30
                        ? chat.latestMessage.content.slice(0, 30) + '...'
                        : chat.latestMessage.content)
                    : 'No messages yet'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
