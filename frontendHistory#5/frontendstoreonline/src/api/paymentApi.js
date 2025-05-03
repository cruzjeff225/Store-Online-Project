import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configuración global de axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token a todas las solicitudes
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Interceptor - Token encontrado:', token); // Esto ya lo tienes
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Headers configurados:', config.headers); // Añade esto para depuración
  } else {
    console.warn('Interceptor - No se encontró token');
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Manejo específico para errores 401
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login?session_expired=1';
      }
      
      const errorData = {
        message: error.response.data?.message || 'Error en la solicitud',
        status: error.response.status,
        data: error.response.data,
        code: error.code
      };
      return Promise.reject(errorData);
    } else if (error.request) {
      return Promise.reject({
        message: 'No se recibió respuesta del servidor',
        status: null,
        data: null
      });
    } else {
      return Promise.reject({
        message: error.message || 'Error al configurar la solicitud',
        status: null,
        data: null
      });
    }
  }
);

export const paymentApi = {
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/metodos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      throw error;
    }
  },

  processPayment: async (paymentData) => {
    try {
      // Validación mejorada
      const requiredFields = ['id_usuario', 'id_metodo', 'direccion_envio'];
      const missingFields = requiredFields.filter(field => !paymentData[field]);
      
      if (missingFields.length > 0) {
        throw {
          message: 'Datos de pago incompletos',
          status: 400,
          data: { missingFields }
        };
      }

      const response = await api.post('/procesar', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error al procesar pago:', error);
      throw error;
    }
  },

  getPaymentHistory: async (userId) => {
    try {
      const response = await api.get(`/historial/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial de pagos:', error);
      throw error;
    }
  },

  getPaymentDetails: async (paymentId) => {
    try {
      // Validación reforzada
      if (!paymentId || isNaN(Number(paymentId))) {
        throw {
          message: 'ID de pago no válido',
          status: 400,
          suggestion: 'El ID debe ser un número'
        };
      }
  
      // Agregar timeout específico para esta solicitud
      const source = axios.CancelToken.source();
      const timeout = setTimeout(() => {
        source.cancel(`Timeout al obtener detalles del pago después de 8 segundos`);
      }, 8000);
  
      const response = await api.get(`/detalle/${paymentId}`, {
        cancelToken: source.token
      });
      
      clearTimeout(timeout);
  
      // Verificación más completa de la respuesta
      if (!response || !response.data || !response.data.id_pago) {
        throw {
          message: 'Respuesta del servidor incompleta',
          status: 204,
          suggestion: 'Intente nuevamente o contacte al soporte'
        };
      }
  
      // Verificación crítica
      if (response.data.id_pago.toString() !== paymentId.toString()) {
        console.error('ID mismatch:', {
          requestedId: paymentId,
          receivedId: response.data.id_pago,
          fullResponse: response.data
        });
        throw {
          message: 'Inconsistencia en los datos del pago',
          status: 500,
          suggestion: 'Contacte al soporte técnico'
        };
      }
  
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error('Request canceled:', error.message);
        throw {
          message: 'Tiempo de espera agotado',
          details: error.message,
          status: 504,
          suggestion: 'Intente nuevamente más tarde'
        };
      }
      
      console.error('Error in getPaymentDetails:', {
        endpoint: `/detalle/${paymentId}`,
        error: error.response?.data || error.message,
        stack: error.stack,
        config: error.config
      });
      
      throw error;
    }
  },
  vaciarCarrito: async (userId) => {
    try {
      const response = await api.delete(`/vaciar/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      throw error;
    }
  }
};