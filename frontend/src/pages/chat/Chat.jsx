import React, { useEffect, useState } from 'react';
import { getAllChats } from '../../services/chatService';
import ChatList from '../chat/ChatList';
import ChatWindow from '../chat/ChatWindow';

const Chat = ({ unreadCounts, selectedChat, setSelectedChat }) => {
  const [chats, setChats] = useState([]);
  // Remove local selectedChat state

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await getAllChats();
      setChats(res);
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      <ChatList chats={chats} onSelectChat={setSelectedChat} selectedChat={selectedChat} unreadCounts={unreadCounts} />
      <ChatWindow selectedChat={selectedChat} />
    </div>
  );
};

export default Chat;
