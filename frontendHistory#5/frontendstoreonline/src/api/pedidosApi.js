import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Configuración de axios para incluir el token en las peticiones
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Obtener detalles completos de un pedido
export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/admin/pedidos/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// Obtener lista de pedidos
export const getOrdersList = async (params = {}) => {
  try {
    const response = await api.get('/admin/pedidos', { params });
    return {
      pedidos: response.data.pedidos || [],
      pagination: response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
      }
    };
  } catch (error) {
    console.error('Error fetching orders list:', error);
    return {
      pedidos: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
      }
    };
  }
};

// Actualizar estado de un pedido
export const updateOrderStatus = async (orderId, status, comentario = '') => {
  try {
    const response = await api.put(`/admin/pedidos/${orderId}/estado`, { 
      estado: status,
      comentario 
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Obtener pedidos pendientes críticos
export const getCriticalPendingOrders = async (horasLimite = 24) => {
  try {
    const response = await api.get('/admin/pedidos/pendientes/criticos', {
      params: { horasLimite }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching critical pending orders:', error);
    throw error;
  }
};