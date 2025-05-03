import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../Context/NotificationContext';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, fetchNotifications } = useNotifications();

  const handleNotificationClick = (notification) => {
    if (!notification.leida && notification.id_notificacion) {
      markAsRead(notification.id_notificacion);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) fetchNotifications(true);
        }}
        className="text-white hover:text-primary-300 focus:outline-none transition-colors duration-200 relative"
        aria-label="Notificaciones"
      >
        <div className="relative">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-danger-500 rounded-full animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-dropdown overflow-hidden z-50 border border-gray-200 transform transition-all duration-200 ease-in-out">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Notificaciones</h3>
              <Link 
                to="/notificaciones" 
                className="text-xs text-primary-500 hover:text-primary-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Ver todas
              </Link>
            </div>
            
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No hay notificaciones</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={`notif-${notification.id_notificacion}-${notification.fecha_creacion}`}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                      !notification.leida ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-sm ${
                          !notification.leida ? 'font-semibold text-gray-900' : 'font-normal text-gray-700'
                        }`}>
                          {notification.titulo}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.mensaje}</p>
                      </div>
                      {!notification.leida && (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary-500"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.fecha_creacion), { 
                        addSuffix: true, 
                        locale: es 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;