import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import api from '../services/api';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const stompClientRef = useRef(null);

  // Fetch initial notifications and count
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data);

      const countRes = await api.get('/api/notifications/unread-count');
      setUnreadCount(countRes.data);
    } catch (err) {
      console.error('Error fetching notifications', err);
    }
  };

  useEffect(() => {
    console.log('NotificationProvider useEffect triggered. User status:', user ? `Logged in as ${user.name}` : 'Logged out');
    if (user) {
      fetchNotifications();
      connectWebSocket();
    } else {
      disconnectWebSocket();
      setNotifications([]);
      setUnreadCount(0);
    }

    return () => {
      console.log('NotificationProvider useEffect cleanup running.');
      disconnectWebSocket();
    };
  }, [user]);

  const connectWebSocket = () => {
    if (stompClientRef.current) {
      console.log('connectWebSocket called, but connection already exists.');
      return;
    }

    const token = user.token;
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const wsProtocol = backendUrl.startsWith('https') ? 'wss://' : 'ws://';
    const wsHost = backendUrl.replace(/^(https?:\/\/)/, '');
    const brokerURL = `${wsProtocol}${wsHost}/ws/websocket`;

    console.log(`Attempting STOMP WebSocket connection to ${brokerURL}`);
    const client = new Client({
      brokerURL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log('STOMP connected successfully!', frame);
        // Subscribe to user-specific queue
        client.subscribe('/user/queue/notifications', (message) => {
          if (message.body) {
            const notification = JSON.parse(message.body);
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);
            toast.info(notification.message, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP broker error:', frame.headers['message']);
      },
      onWebSocketClose: (evt) => {
        console.log('STOMP onWebSocketClose callback triggered.', evt);
      }
    });

    client.activate();
    stompClientRef.current = client;
  };

  const disconnectWebSocket = () => {
    console.log('disconnectWebSocket() invoked. Client ref exists:', stompClientRef.current !== null);
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
      console.log('STOMP client deactivated (disconnect completed).');
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all notifications as read', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
