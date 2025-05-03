import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Ajusta la URL según tu backend

// Obtener todos los productos
export const getAllProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw error;
  }
};

// Obtener productos por categoría
export const getProductosByCategoria = async (id_categoria) => {
  try {
    const response = await axios.get(`${API_URL}/productos/categoria/${id_categoria}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los productos por categoría:', error);
    throw error;
  }
};

// Obtener un producto por su ID
export const getProductoById = async (id_producto) => {
  try {
    const response = await axios.get(`${API_URL}/productos/${id_producto}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    throw error;
  }
};

// Obtener todas las categorías
export const getAllCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/categorias`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    throw error;
  }
};



// Buscar productos por nombre o categoría
export const searchProductos = async (query) => {
  try {
    const response = await axios.post(`${API_URL}/productos/search`, { query });
    return response.data;
  } catch (error) {
    console.error('Error al buscar productos:', error);
    throw error;
  }
};

// Filtrar productos por precio, marca o categoría
export const filterProductos = async (filters) => {
  try {
    const response = await axios.post(`${API_URL}/productos/filter`, filters);
    return response.data;
  } catch (error) {
    console.error('Error al filtrar productos:', error);
    throw error;
  }
};