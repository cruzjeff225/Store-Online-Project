import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Registrar un nuevo usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    throw error;
  }
};

// Iniciar sesión
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Solicitar recuperación de contraseña
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { correo: email });
    return response.data;
  } catch (error) {
    console.error('Error al solicitar recuperación de contraseña:', error);
    throw error;
  }
};

// Restablecer la contraseña
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { token, nuevaContrasena: newPassword });
    return response.data;
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    throw error;
  }
};

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
}, (error) => {
  return Promise.reject(error);
});

// Añade esta función para validar el token
export const validateToken = async () => {
  try {
    const response = await api.get('/validate-token');
    return response.data;
  } catch (error) {
    console.error('Error validating token:', error);
    throw error;
  }
};

// Mejora el interceptor de respuestas
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar validar el token actual primero
        const validation = await validateToken();
        
        if (validation.valid) {
          // Si el token es válido pero aún recibimos 401, puede ser otro error
          return Promise.reject(error);
        }
        
        // Si llegamos aquí, el token no es válido
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
        return Promise.reject(error);
      } catch (validationError) {
        console.error('Error validating token:', validationError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
        return Promise.reject(validationError);
      }
    }

    return Promise.reject(error);
  }
);

// Obtener pedidos de administrador
export const getAdminOrders = async (params = {}) => {
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
    console.error('Error fetching admin orders:', error);
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

// Actualizar estado del pedido
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await api.put(`/admin/pedidos/${orderId}/estado`, { estado: newStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Obtener pedidos pendientes críticos
export const getPendingOrders = async () => {
  try {
    const response = await api.get('/admin/pedidos/pendientes/criticos');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    throw error;
  }
};