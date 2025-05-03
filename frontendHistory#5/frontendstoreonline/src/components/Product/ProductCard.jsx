import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';

const ProductCard = ({ producto }) => {
  const { addToCart, cart } = useCart();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (userId && cart.items) {
      const itemInCart = cart.items.find(item => item.id_producto === producto.id_producto);
      setIsInCart(!!itemInCart);
    }
  }, [userId, cart.items, producto.id_producto]);

  const handleAddToCart = async () => {
    if (!userId) {
      const shouldLogin = window.confirm('Debes iniciar sesión para agregar productos al carrito. ¿Deseas iniciar sesión ahora?');
      if (shouldLogin) {
        navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
      return;
    }
  
    setIsAdding(true);
    try {
      const response = await addToCart(producto.id_producto, 1);
          
      window.dispatchEvent(new CustomEvent('cart-notification', {
        detail: { 
          message: response?.message || `${producto.nombre} agregado al carrito`, 
          type: 'success' 
        }
      }));
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      window.dispatchEvent(new CustomEvent('cart-notification', {
        detail: { 
          message: error.message || 'Error al agregar al carrito', 
          type: 'error' 
        }
      }));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-card border rounded-lg overflow-hidden shadow hover:shadow-md transition">
      <img 
        src={producto.imagen_url} 
        alt={producto.nombre} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{producto.nombre}</h3>
        <p className="text-gray-600 mb-2 line-clamp-2">{producto.descripcion}</p>
        <p className="font-bold text-blue-600 mb-1">Precio: ${producto.precio}</p>
        <p className="text-sm text-gray-500 mb-1">Stock: {producto.stock}</p>
        <p className="text-sm text-gray-500 mb-3">Marca: {producto.marca}</p>
        <div className="flex justify-between">
          <Link 
            to={`/producto/${producto.id_producto}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ver detalles
          </Link>
          <button 
            onClick={handleAddToCart}
            disabled={isAdding || isInCart}
            className={`px-3 py-1 rounded text-sm transition ${
              isInCart 
                ? 'bg-green-600 text-white cursor-default'
                : isAdding 
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isInCart ? '✔ En carrito' : isAdding ? 'Agregando...' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;