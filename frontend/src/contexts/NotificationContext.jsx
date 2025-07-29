import { createContext, useContext, useState } from 'react';

export const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadCounts, setUnreadCounts] = useState({}); // {chatId: count}

  const incrementUnread = (chatId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [chatId]: (prev[chatId] || 0) + 1,
    }));
  };

  const resetUnread = (chatId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [chatId]: 0,
    }));
  };

  return (
    <NotificationContext.Provider value={{ unreadCounts, incrementUnread, resetUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};
