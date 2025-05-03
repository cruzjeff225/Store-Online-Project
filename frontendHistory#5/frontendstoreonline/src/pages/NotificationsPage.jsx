// src/Pages/NotificationsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Components/Layout/Footer';
import Header from '../Components/Layout/Header';
import NotificationItem from '../components/Notification/NotificationItem';
import { useNotifications } from '../Context/NotificationContext';

const NotificationsPage = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    fetchNotifications, 
    markAsRead, 
    archiveNotification 
  } = useNotifications();

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.leida);
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id_notificacion);
    }
  };

  if (loading) return <div className="text-center py-8">Cargando notificaciones...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Notificaciones</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                Actualizar
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tienes notificaciones</p>
              <Link to="/" className="text-blue-500 hover:text-blue-700 mt-2 inline-block">
                Volver a la tienda
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id_notificacion}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onArchive={archiveNotification}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationsPage;