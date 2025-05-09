import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

 //Iniciar sesión
 export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        console.log('Error al iniciar sesión', error);
        throw error;
    }
 };

//Registrar nuevo usuario
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.log('Error al registrar usuario', error);
        throw error;
    }
};

