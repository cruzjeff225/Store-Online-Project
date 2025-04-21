import { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = ({ userId }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    // Obtener productos del carrito
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`/api/cart/${userId}`);
            setCartItems(response.data);
            calculateTotal(response.data);
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
        }
    };

    // Calcular total
    const calculateTotal = (items) => {
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
        setTotal(totalAmount);
    };

    // Actualizar cantidad de productos
    const updateQuantity = async (idProducto, nuevaCantidad, stockDisponible) => {
        if (nuevaCantidad < 1 || nuevaCantidad > stockDisponible) return; // Validación

        try {
            await axios.put('/api/cart/update', { userId, idProducto, nuevaCantidad });
            const updatedCart = cartItems.map(item => 
                item.idProducto === idProducto ? { ...item, cantidadProducto: nuevaCantidad, subtotal: nuevaCantidad * item.precio } : item
            );
            setCartItems(updatedCart);
            calculateTotal(updatedCart);
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
        }
    };

    // Eliminar producto del carrito
    const removeFromCart = async (idProducto) => {
        try {
            await axios.delete(`/api/cart/${userId}/${idProducto}`);
            const updatedCart = cartItems.filter(item => item.idProducto !== idProducto);
            setCartItems(updatedCart);
            calculateTotal(updatedCart);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    return (
        <div>
            <h2>Carrito de Compras</h2>
            <ul>
                {cartItems.map(item => (
                    <li key={item.idProducto}>
                        {item.nombre} - 
                        <button onClick={() => updateQuantity(item.idProducto, item.cantidadProducto - 1, item.stock)}>-</button>
                        {item.cantidadProducto} 
                        <button onClick={() => updateQuantity(item.idProducto, item.cantidadProducto + 1, item.stock)}>+</button>
                        x ${item.precio} = ${item.subtotal}
                        <button onClick={() => removeFromCart(item.idProducto)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <h3>Total: ${total}</h3>
        </div>
    );
};

export default Cart;
