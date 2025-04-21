import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cart';

// Agregar un producto al carrito
export const addToCart = async (idUsuario, idProducto, cantidadProducto) => {
    try {
        const response = await axios.post(`${API_URL}`, { idUsuario, idProducto, cantidadProducto });
        return response.data;
    } catch (error) {
        console.log('Error en addToCart:', error);
        return { message: 'Error al agregar producto al carrito' };
    }
};

// Obtener la cantidad total de productos en el carrito
export const getCartCount = async (idUsuario) => {
    try {
        const response = await axios.get(`${API_URL}/count/${idUsuario}`);
        return response.data.count;
    } catch (error) {
        console.log('Error en getCartCount:', error);
        return 0;
    }
};

// 🔹 Actualizar la cantidad de un producto en el carrito
export const updateCartQuantity = async (idUsuario, idProducto, nuevaCantidad) => {
    try {
        const response = await axios.put(`${API_URL}/update`, { idUsuario, idProducto, nuevaCantidad });
        return response.data;
    } catch (error) {
        console.log('Error en updateCartQuantity:', error);
        return { message: 'Error al actualizar la cantidad del producto' };
    }
};

// 🔹 Eliminar un producto del carrito
export const removeFromCart = async (idUsuario, idProducto) => {
    try {
        const response = await axios.delete(`${API_URL}/remove`, { data: { idUsuario, idProducto } });
        return response.data;
    } catch (error) {
        console.log('Error en removeFromCart:', error);
        return { message: 'Error al eliminar el producto del carrito' };
    }
};

// 🔹 Vaciar el carrito por completo
export const clearCart = async (idUsuario) => {
    try {
        const response = await axios.delete(`${API_URL}/clear/${idUsuario}`);
        return response.data;
    } catch (error) {
        console.log('Error en clearCart:', error);
        return { message: 'Error al vaciar el carrito' };
    }
};
