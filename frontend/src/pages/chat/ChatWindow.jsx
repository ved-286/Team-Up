import React, { useEffect, useState, useRef } from 'react';
import { getMessagesByChatId, sendMessage } from '../../services/chatService.js';
import { io } from 'socket.io-client';
import { useNotification } from '../../contexts/notificationContext.jsx';
import { toast } from 'react-toastify';

const ChatWindow = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { incrementUnread, resetUnread } = useNotification();

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
      console.log("🔗 Socket ready to join rooms");
    });

    return () => {
      console.log("🔌 Disconnecting socket:", newSocket.id);
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
      console.log('🔗 Attempting to join room:', selectedChat._id);
      console.log('🔗 Socket connected:', socket.connected);
      console.log('🔗 Socket ID:', socket.id);
      
      socket.emit('join-chat', selectedChat._id);
      resetUnread(selectedChat._id); // ✅ Reset unread count on open
      console.log('✅ Joined room:', selectedChat._id);
    } else {
      console.log('❌ Cannot join room:', {
        hasSelectedChat: !!selectedChat?._id,
        hasSocket: !!socket,
        selectedChatId: selectedChat?._id,
        socketConnected: socket?.connected
      });
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
      const isMine = newMsg?.sender?._id === userId;

      if (incomingChatId === selectedChat?._id) {
        setMessages((prev) => {
          const messageExists = prev.some(msg => msg._id === newMsg._id);
          return messageExists ? prev : [...prev, newMsg];
        });
      } else if (!isMine) {
        incrementUnread(incomingChatId);
        toast.info(`📩 New message from ${newMsg.sender?.username || 'someone'}`);
      }
    };

    socket.on('message-received', handleIncoming);
    return () => socket.off('message-received', handleIncoming);
  }, [selectedChat, socket]);

  // Listen for typing events
  // 🧠 Typing indicator socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ chatId, userId: typingUserId }) => {
      console.log("📝 Frontend received typing event:", { chatId, typingUserId, currentUserId: userId, selectedChatId: selectedChat?._id });
      
      if (
        chatId === selectedChat?._id &&
        typingUserId !== userId
      ) {
        console.log("✅ Adding typing user:", typingUserId);
        setTypingUsers((prev) => {
          const newSet = new Set(prev).add(typingUserId);
          console.log("👥 Updated typing users:", Array.from(newSet));
          return newSet;
        });
      } else {
        console.log("❌ Typing event ignored:", {
          chatIdMatch: chatId === selectedChat?._id,
          userIdMatch: typingUserId !== userId,
          chatId,
          typingUserId,
          selectedChatId: selectedChat?._id,
          currentUserId: userId
        });
      }
    };

    const handleStopTyping = ({ chatId, userId: typingUserId }) => {
      console.log("🛑 Frontend received stop-typing event:", { chatId, typingUserId, currentUserId: userId, selectedChatId: selectedChat?._id });
      
      if (
        chatId === selectedChat?._id &&
        typingUserId !== userId
      ) {
        console.log("✅ Removing typing user:", typingUserId);
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(typingUserId);
          console.log("👥 Updated typing users:", Array.from(newSet));
          return newSet;
        });
      } else {
        console.log("❌ Stop-typing event ignored:", {
          chatIdMatch: chatId === selectedChat?._id,
          userIdMatch: typingUserId !== userId,
          chatId,
          typingUserId,
          selectedChatId: selectedChat?._id,
          currentUserId: userId
        });
      }
    };

    socket.on('typing', handleTyping);
    socket.on('stop-typing', handleStopTyping);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('stop-typing', handleStopTyping);
    };
  }, [socket, selectedChat?._id, userId]);

  // Handle typing indicator
  // ✏️ Emit typing
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (!isTyping && selectedChat?._id) {
      console.log("✏️ Starting typing indicator for chat:", selectedChat._id);
      setIsTyping(true);
      socket.emit('typing', {
        chatId: selectedChat._id,
        userId: userId,
      });
      console.log("📤 Emitted typing event:", { chatId: selectedChat._id, userId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping && selectedChat?._id) {
        console.log("⏰ Stopping typing indicator (timeout) for chat:", selectedChat._id);
        setIsTyping(false);
        socket.emit('stop-typing', {
          chatId: selectedChat._id,
          userId: userId,
        });
        console.log("📤 Emitted stop-typing event:", { chatId: selectedChat._id, userId });
      }
    }, 3000); // Increased from 1000ms to 3000ms for better testing
  };
  // Send message to backend + socket
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !socket) return;
    
    // Stop typing indicator when sending message
    if (isTyping && selectedChat?._id) {
      console.log("📤 Stopping typing indicator (sending message) for chat:", selectedChat._id);
      setIsTyping(false);
      socket.emit('stop-typing', {
        chatId: selectedChat._id,
        userId: userId,
      });
      console.log("📤 Emitted stop-typing event (send message):", { chatId: selectedChat._id, userId });
    }
    
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      console.log("🧹 Cleared typing timeout");
    }
    
    try {
      const newMsg = await sendMessage(selectedChat._id, {
        content: messageInput,
        chatId: selectedChat._id,
      });

      socket.emit('new-message', newMsg);
      setMessageInput('');
      console.log("✅ Message sent successfully");
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Debug typing users state
  useEffect(() => {
    console.log("🔍 Typing users state changed:", {
      size: typingUsers.size,
      users: Array.from(typingUsers),
      selectedChatId: selectedChat?._id,
      currentUserId: userId
    });
  }, [typingUsers, selectedChat?._id, userId]);

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
        
        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className={`text-sm ${theme.textSecondary}`}>
              {typingUsers.size === 1 ? 'Someone is typing...' : `${typingUsers.size} people are typing...`}
            </span>
          </div>
        )}
        
        {/* Debug Info - Remove this after testing */}
        {/* <div className="px-4 py-2 text-xs text-gray-500">
          Debug: typingUsers.size = {typingUsers.size}, users: {Array.from(typingUsers).join(', ')}
        </div> */}
      </div>

      {/* Input */}
      {selectedChat && (
        <div className={`px-4 py-3 ${theme.bgInput} border-t ${theme.border} flex gap-3 items-center`}>
          <input
            type="text"
            placeholder="Type a message..."
            className={`flex-1 ${theme.input} rounded-full px-4 py-2 text-sm outline-none`}
            value={messageInput}
            onChange={handleInputChange}
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