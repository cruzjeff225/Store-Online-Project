// src/Context/NotificationContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { archiveNotification, getNotifications, markAsRead } from '../api/notificationApi';
import { setupWebSocket } from '../api/websocket';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wsCleanup, setWsCleanup] = useState(() => {});

  const fetchNotifications = useCallback(async (unreadOnly = false) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const data = await getNotifications(unreadOnly);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.leida).length);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleNewNotification = useCallback((newNotification) => {
    setNotifications(prev => {
      // Verificar si ya existe una notificación con el mismo id
      const exists = prev.some(n => n.id_notificacion === newNotification.id_notificacion);
      if (!exists) {
        return [newNotification, ...prev];
      }
      return prev;
    });
  
    // Actualizar contador solo si es una notificación no leída
    if (!newNotification.leida) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const markNotificationAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id_notificacion === notificationId ? { ...n, leida: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const archiveNotificationById = async (notificationId) => {
    try {
      await archiveNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id_notificacion !== notificationId));
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Error archiving notification:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id_usuario) {
      fetchNotifications(); // Fetch initial notifications
      
      // Configurar WebSocket
      const cleanup = setupWebSocket(
        user.id_usuario,
        localStorage.getItem('token'),
        handleNewNotification, // Update state on new notification
        (error) => console.error('WebSocket error:', error)
      );
      setWsCleanup(() => cleanup);

      return () => {
        cleanup(); // Limpiar WebSocket al desmontar
      };
    }
  }, [isAuthenticated, user?.id_usuario, fetchNotifications, handleNewNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      error,
      fetchNotifications,
      markAsRead: markNotificationAsRead,
      archiveNotification: archiveNotificationById
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);