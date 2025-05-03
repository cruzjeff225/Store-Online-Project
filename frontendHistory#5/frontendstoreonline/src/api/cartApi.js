import axios from 'axios';

// cartApi.js - Versión corregida
const API_URL = 'http://localhost:3000/api'; // Mantén esto sin /carrito

// Configura axios para incluir el token en todas las solicitudes
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('Interceptor - Token encontrado:', token); // Debug
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('Interceptor - No se encontró token'); // Debug
  }
  return config;
}, error => {
  console.error('Interceptor error:', error); // Debug
  return Promise.reject(error);
});

// Normalización de respuestas del carrito
const normalizeCartResponse = (response) => {
  if (!response.data || !response.data.data) {
    throw new Error('Respuesta vacía del servidor');
  }

  const cartData = response.data.data;
  
  return {
    id_carrito: cartData.id_carrito || null,
    items: Array.isArray(cartData.items) ? 
      cartData.items.map(item => ({
        id_detalle: item.id_detalle,
        id_producto: item.id_producto,
        nombre: item.nombre,
        descripcion: item.descripcion,
        imagen_url: item.imagen_url,
        precio: parseFloat(item.precio || 0),
        cantidad: parseInt(item.cantidad || 1),
        subtotal: parseFloat(item.subtotal || 0),
        stock_disponible: parseInt(item.stock_disponible || 0)
      })) : [],
    subtotal: parseFloat(cartData.subtotal || 0),
    iva: parseFloat(cartData.iva || 0),
    total: parseFloat(cartData.total || 0)
  };
};

export const getCart = async () => {
  try {
    const response = await axios.get(`${API_URL}/`); // Ruta es /api/
    return normalizeCartResponse(response);
  } catch (error) {
    console.error('Error en getCart:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    }); // Debug detallado
    throw error.response?.data || error;
  }
};

export const addToCart = async (productId, quantity) => {
  try {
    const response = await axios.post(`${API_URL}/agregar`, { // Ruta es /api/agregar
      id_producto: productId,
      cantidad: quantity
    });
    return normalizeCartResponse(response);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    throw error.response?.data || error;
  }
};

export const removeFromCart = async (detailId) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminar/${detailId}`);
    return normalizeCartResponse(response);
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    throw error.response?.data || error;
  }
};

export const updateCartItem = async (detailId, quantity) => {
  try {
    const response = await axios.put(`${API_URL}/actualizar/${detailId}`, {
      cantidad: quantity
    });
    return normalizeCartResponse(response);
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    throw error.response?.data || error;
  }
};

export const clearCart = async () => {
  try {
    const response = await axios.delete(`${API_URL}/vaciar`);
    return normalizeCartResponse(response);
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    throw error.response?.data || error;
  }
};