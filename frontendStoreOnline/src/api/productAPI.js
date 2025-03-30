import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        console.log("Respuesta de la API: ", response.data);
        
        return response.data;
    } catch (error) {
        console.log('Error en getProducts', error);
        throw error;
    }
};

export const searchProducts = async (nombreProducto) => {
    try {
        const response = await axios.get(`${API_URL}/products/search?nombreProducto=${nombreProducto}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.log('Error al buscar productos', error);
        return [];
    }
};

export const filterProducts = async (categoriaProducto) => {
    try {
        const response = await axios.get(`${API_URL}/products/filter?categoriaProducto=${categoriaProducto}`);
        return response.data;
    } catch (error) {
        console.log('Error al filtrar prodcutos', error);
        throw error;
    }
};

