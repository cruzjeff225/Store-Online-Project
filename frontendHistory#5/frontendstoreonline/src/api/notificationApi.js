// src/api/notificationApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/notificaciones';

export const getNotifications = async (unreadOnly = false) => {
  try {
    const response = await axios.get(API_URL, {
      params: { soloNoLeidas: unreadOnly },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener notificaciones');
  }
};

export const markAsRead = async (id_notificacion) => {
  if (!id_notificacion) {
    throw new Error('ID de notificación no proporcionado');
  }
  try {
    await axios.put(`${API_URL}/${id_notificacion}/leer`, {}, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al marcar como leída');
  }
};

export const archiveNotification = async (notificationId) => {
  try {
    await axios.put(`${API_URL}/${notificationId}/archivar`, {}, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al archivar notificación');
  }
};