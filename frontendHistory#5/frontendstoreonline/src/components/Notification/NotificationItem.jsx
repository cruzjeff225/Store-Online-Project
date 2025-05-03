// src/Components/Notification/NotificationItem.jsx
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';
import { Link } from 'react-router-dom';

const NotificationItem = ({ notification, onMarkAsRead, onArchive }) => {
  return (
    <div className={`p-4 border-b border-gray-200 ${!notification.leida ? 'bg-blue-50' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`text-sm ${!notification.leida ? 'font-semibold' : 'font-normal'} text-gray-800`}>
            {notification.titulo}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{notification.mensaje}</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(notification.fecha_creacion), { addSuffix: true, locale: es })}
          </p>
        </div>
        {!notification.leida && (
          <button
            onClick={() => onMarkAsRead(notification.id_notificacion)}
            className="ml-2 text-xs text-blue-500 hover:text-blue-700"
          >
            Marcar como leída
          </button>
        )}
      </div>
      <div className="mt-2 flex justify-end space-x-2">
        {/* Botón para ver orden si la notificación está relacionada con un pedido */}
        {notification.id_pedido && (
          <Link
            to={`/orden/${notification.id_pedido}`}
            className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
          >
            Ver Orden
          </Link>
        )}
        <button
          onClick={() => onArchive(notification.id_notificacion)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Archivar
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;