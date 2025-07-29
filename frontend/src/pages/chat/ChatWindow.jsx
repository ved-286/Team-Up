import React, { useEffect, useState, useRef } from 'react';
import { getMessagesByChatId, sendMessage } from '../../services/chatService.js';
import { io } from 'socket.io-client';

const ChatWindow = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id || user?.id || '';

  const otherUser = !selectedChat?.isGroupChat
    ? selectedChat?.participants?.find((u) => u._id !== userId)
    : null;

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5001");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedChat]);

  // Join chat room on selection
  useEffect(() => {
    if (selectedChat?._id && socket) {
      socket.emit('join-chat', selectedChat._id);
      console.log('🔗 joined room:', selectedChat._id);
    }
  }, [selectedChat, socket]);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat?._id) return;
      try {
        const data = await getMessagesByChatId(selectedChat._id);
        const sorted = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setMessages(sorted);
      } catch (err) {
        console.error('❌ Failed to load messages:', err);
        setMessages([]);
      }
    };
    loadMessages();
  }, [selectedChat]);

  // Listen for incoming socket messages
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (newMsg) => {
      const incomingChatId = newMsg?.chat?._id || newMsg?.chatId;
      if (incomingChatId === selectedChat?._id) {
        // Check if message already exists to prevent duplicates
        setMessages((prev) => {
          const messageExists = prev.some(msg => msg._id === newMsg._id);
          if (messageExists) {
            return prev; // Don't add if already exists
          }
          return [...prev, newMsg];
        });
      } else {
        console.log('🔔 Incoming message for other chat:', incomingChatId);
      }
    };

    socket.on('message-received', handleIncoming);
    return () => socket.off('message-received', handleIncoming);
  }, [selectedChat, socket]);

  // Send message to backend + socket
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !socket) return;
    try {
      const newMsg = await sendMessage(selectedChat._id, {
        content: messageInput,
        chatId: selectedChat._id,
      });

      // Don't add message locally since it will come back via socket
      // setMessages((prev) => [...prev, newMsg]); // Removed this line
      socket.emit('new-message', newMsg);
      setMessageInput('');
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  };

  // Theme styles
  const theme = {
    bgMain: 'bg-gray-900',
    bgHeader: 'bg-gray-800',
    bgInput: 'bg-gray-800',
    border: 'border-gray-700',
    textPrimary: 'text-gray-100',
    textSecondary: 'text-gray-400',
    accent: 'bg-blue-700',
    accentHover: 'hover:bg-blue-800',
    myMsg: 'bg-blue-700 text-white',
    otherMsg: 'bg-gray-800 text-gray-100 border border-gray-700',
    input: 'bg-gray-900 text-gray-100 border border-gray-700',
  };

  const getAvatarUrl = (sender) => {
    if (!sender) return '';
    if (sender.avatar) return sender.avatar;
    if (sender.email)
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(sender.email)}`;
    return `https://api.dicebear.com/7.x/bottts/svg?seed=user`;
  };

  return (
    <div className={`flex flex-col h-full w-full ${theme.bgMain}`}>
      {/* Header */}
      <div className={`px-4 py-3 ${theme.bgHeader} border-b ${theme.border} flex items-center gap-3`}>
        {!selectedChat ? (
          <p className={`${theme.textSecondary}`}>Select a chat to start messaging</p>
        ) : selectedChat.isGroupChat ? (
          <div>
            <h2 className="text-lg font-semibold text-white">{selectedChat.name}</h2>
            <p className={`text-sm ${theme.textSecondary}`}>Group Chat</p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
              {otherUser?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-base font-medium text-white">{otherUser?.username || 'User'}</h2>
              <p className={`text-sm ${theme.textSecondary}`}>{otherUser?.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto px-4 py-3 ${theme.bgMain} space-y-3`}>
        {messages.length === 0 ? (
          <p className={`text-center ${theme.textSecondary} mt-8`}>No messages yet.</p>
        ) : (
          <>
            {messages.map((msg) => {
              const isMine = msg?.sender?._id === userId;
              const sender = msg?.sender || {};
              const avatarUrl = getAvatarUrl(sender);
              return (
                <div key={msg._id} className={`flex items-end ${isMine ? 'justify-end' : 'justify-start'}`}>
                  {!isMine && (
                    <img
                      src={avatarUrl}
                      alt={sender?.name || sender?.email || 'User'}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                  )}
                  <div
                    className={`px-4 py-2 max-w-xs text-sm rounded-lg ${
                      isMine ? `${theme.myMsg} rounded-br-none` : `${theme.otherMsg} rounded-bl-none`
                    }`}
                  >
                    {msg.content}
                  </div>
                  {isMine && (
                    <img
                      src={avatarUrl}
                      alt={sender?.name || sender?.email || 'Me'}
                      className="w-8 h-8 rounded-full object-cover ml-2"
                    />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      {selectedChat && (
        <div className={`px-4 py-3 ${theme.bgInput} border-t ${theme.border} flex gap-3 items-center`}>
          <input
            type="text"
            placeholder="Type a message..."
            className={`flex-1 ${theme.input} rounded-full px-4 py-2 text-sm outline-none`}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className={`px-4 py-2 ${theme.accent} text-white rounded-full ${theme.accentHover} text-sm`}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
