import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as cartApi from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userId, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    iva: 0,
    total: 0,
    loading: false,
    error: null
  });

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      const cartData = await cartApi.getCart();
      setCart({
        items: cartData.items,
        subtotal: cartData.subtotal,
        iva: cartData.iva,
        total: cartData.total,
        loading: false,
        error: null
      });
    } catch (error) {
      setCart(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al cargar el carrito'
      }));
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      const updatedCart = await cartApi.addToCart(productId, quantity);  
      setCart({
        items: updatedCart.items,
        subtotal: updatedCart.subtotal,
        iva: updatedCart.iva,
        total: updatedCart.total,
        loading: false,
        error: null
      });
      return true;
    } catch (error) {
      setCart(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al agregar al carrito'
      }));
      return false;
    }
  }, []);

  const removeFromCart = useCallback(async (detailId) => {
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      const updatedCart = await cartApi.removeFromCart(detailId);
      setCart({
        items: updatedCart.items,
        subtotal: updatedCart.subtotal,
        iva: updatedCart.iva,
        total: updatedCart.total,
        loading: false,
        error: null
      });
    } catch (error) {
      setCart(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al eliminar del carrito'
      }));
    }
  }, []);

  const updateQuantity = useCallback(async (detailId, quantity) => {
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      const updatedCart = await cartApi.updateCartItem(detailId, quantity);
      setCart({
        items: updatedCart.items,
        subtotal: updatedCart.subtotal,
        iva: updatedCart.iva,
        total: updatedCart.total,
        loading: false,
        error: null
      });
    } catch (error) {
      setCart(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al actualizar cantidad'
      }));
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      await cartApi.clearCart();
      setCart({
        items: [],
        subtotal: 0,
        iva: 0,
        total: 0,
        loading: false,
        error: null
      });
    } catch (error) {
      setCart(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al vaciar el carrito'
      }));
    }
  }, []);

  // Cargar el carrito cuando el usuario cambie
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart({
        items: [],
        subtotal: 0,
        iva: 0,
        total: 0,
        loading: false,
        error: null
      });
    }
  }, [isAuthenticated, loadCart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};