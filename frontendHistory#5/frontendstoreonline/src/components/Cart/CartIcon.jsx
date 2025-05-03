import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';

const CartIcon = () => {
  const { cart, loadCart } = useCart();

  // Cargar el carrito cuando el componente se monte
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const itemCount = cart.items?.reduce((total, item) => total + (item.cantidad || 0), 0) || 0;

  return (
    <Link to="/carrito" className="cart-icon relative">
      🛒
      {itemCount > 0 && (
        <span className="cart-count absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default React.memo(CartIcon);