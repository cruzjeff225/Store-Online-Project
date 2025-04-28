import { useEffect, useState } from "react";
import axios from 'axios';

const NotificationList = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
  
    useEffect(() => {
      axios.get(`http://localhost:3000/api/notifications/${userId}`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error(err));
    }, [userId]);
  
    return (
      <div className="p-4 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-2">Notificaciones</h2>
        {notifications.length === 0 ? (
          <p>No tienes notificaciones aún.</p>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n.idNotificacion} className="border-b py-2">
                {n.mensaje} <span className="text-sm text-gray-500">({new Date(n.fecha).toLocaleString()})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default NotificationList;