import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:3000/api';

  // Configuración de axios para el AuthContext
  const authAxios = axios.create({
    baseURL: API_URL,
    timeout: 5000,
  });

  // Función para validar el token con el backend
  const validateToken = async (token) => {
    try {
      const response = await authAxios.get('/validate-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error validating token:', error);
      throw error;
    }
  };

  // Función para decodificar el token JWT
  const decodeToken = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Primero validar el token con el backend
          const validation = await validateToken(token);
          
          if (validation?.valid) {
            const parsedUser = JSON.parse(storedUser);
            const decoded = decodeToken(token);
            
            // Actualizar el estado con los datos completos
            setUser({
              ...parsedUser,
              token,
              isAuthenticated: true,
              es_admin: validation.user?.id_rol === 1 || decoded?.es_admin || false
            });
          } else {
            // Token inválido, limpiar almacenamiento
            logout();
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData) => {
    if (!userData.token) {
      throw new Error('No se recibió token en la respuesta de autenticación');
    }
  
    try {
      // Validar el token recién obtenido
      const validation = await validateToken(userData.token);
      
      if (!validation.valid) {
        throw new Error('Token inválido');
      }

      const decoded = decodeToken(userData.token);
      
      // Crear objeto de usuario
      const userWithToken = {
        ...userData.user,
        token: userData.token,
        id_usuario: decoded?.id || userData.user.id_usuario,
        correo: decoded?.correo || userData.user.correo,
        isAuthenticated: true,
        es_admin: validation.user?.id_rol === 1 || decoded?.es_admin || false
      };
  
      // Guardar en localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userWithToken));
      
      // Establecer en estado
      setUser(userWithToken);
      
      return userWithToken;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      isAuthenticated: !!user?.isAuthenticated,
      userId: user?.id_usuario,
      userEmail: user?.correo,
      isAdmin: user?.es_admin || false,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};