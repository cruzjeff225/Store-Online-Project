import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cart';

export const addToCart = async (idUsuario, idProducto, cantidadProducto) => {
    try {
        const response = await axios.post(`${API_URL}`, {idUsuario, idProducto, cantidadProducto});
        return response.data;
    } catch (error) {
        console.log('Error en addToCart:', error);
        return { message: 'Error al agregar producto al carrito'};
    }
};

export const getCartCount = async (idUsuario) => {
    try {
        const response = await axios.get(`${API_URL}/count/${idUsuario}`);
        return response.data.count;
    } catch (error) {
        console.log('Error en getCartCount');
        return 0;
    }
}
