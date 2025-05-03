import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';

const CartPage = () => {
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, loadCart } = useCart();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user) {
      loadCart();
    }

    const handleNotification = (e) => {
      setNotification(e.detail);
      setTimeout(() => setNotification(null), 3000);
    };

    window.addEventListener('cart-notification', handleNotification);
    return () => window.removeEventListener('cart-notification', handleNotification);
  }, [user, loadCart]);

  const handleQuantityChange = async (detailId, newQuantity) => {
    if (newQuantity > 0) {
      try {
        await updateQuantity(detailId, newQuantity);
      } catch (error) {
        const event = new CustomEvent('cart-notification', {
          detail: { 
            message: error.message || 'Error al actualizar cantidad', 
            type: 'error' 
          }
        });
        window.dispatchEvent(event);
      }
    }
  };

  if (!user) {
    return <Navigate to="/auth/login?redirect=/carrito" replace />;
  }

  if (cart.loading) return <div className="text-center py-8">Cargando carrito...</div>;
  if (cart.error) return <div className="text-center text-red-500 py-8">{cart.error}</div>;

  return (
    <div className="cart-page container mx-auto py-8 px-4">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${
          notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {notification.message}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Tu Carrito de Compras</h1>
      
      {cart.items.length === 0 ? (
        <div className="empty-cart text-center py-8">
          <p className="text-xl mb-4">Tu carrito está vacío</p>
          <Link 
            to="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Continuar comprando
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="cart-items md:w-2/3">
            {cart.items.map((item) => (
              <div key={item.id_detalle} className="cart-item flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-200">
                <img 
                  src={item.imagen_url || '/placeholder-product.png'} 
                  alt={item.nombre} 
                  className="cart-item-image w-24 h-24 object-cover"
                />
                <div className="cart-item-details flex-grow">
                  <h3 className="text-lg font-semibold">{item.nombre}</h3>
                  <p>Precio unitario: ${item.precio.toFixed(2)}</p>
                  <p>Stock disponible: {item.stock_disponible}</p>
                  <div className="quantity-controls flex items-center gap-2 my-2">
                    <button 
                      onClick={() => handleQuantityChange(item.id_detalle, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                      className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-2">{item.cantidad}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id_detalle, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock_disponible}
                      className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <p>Subtotal: ${item.subtotal.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id_detalle)}
                  className="bg-red-500 text-white px-3 py-1 rounded self-start sm:self-center"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary md:w-1/3 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Resumen de Compra</h2>
            <div className="summary-row flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row flex justify-between mb-2">
              <span>IVA (13%):</span>
              <span>${cart.iva.toFixed(2)}</span>
            </div>
            <div className="summary-row flex justify-between font-bold text-lg my-4">
              <span>Total:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            
            <Link 
              to="/checkout" 
              className="block bg-green-600 text-white text-center py-3 rounded hover:bg-green-700 transition"
            >
              Proceder al Pago
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;