import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './components/Auth/PrivateRoute';
import { AuthProvider } from './Context/AuthContext';
import { CartProvider } from './Context/CartContext';
import { NotificationProvider } from './Context/NotificationContext';
import AuthPage from './Pages/AuthPage';
import CartPage from './Pages/CartPage';
import CatalogoPage from './Pages/CatalogoPage';
import CategoriaPage from './pages/CategoriaPage';
import HomePage from './Pages/HomePage';
import OrderManagementPage from './Pages/OrderManagementPage';
import ProductPage from './Pages/ProductPage';
import SearchResultsPage from './Pages/SearchResultsPage';

const stripePromise = loadStripe('tu_clave_publica_de_stripe');

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Elements stripe={stripePromise}>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/auth/:action" element={<AuthPage />} />
                <Route path="/producto/:id_producto" element={<ProductPage />} />
                <Route path="/buscar" element={<SearchResultsPage />} />
                <Route path="/filtrar" element={<SearchResultsPage />} />
                <Route path="/categoria/:id_categoria" element={<CategoriaPage />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/catalogo" element={<CatalogoPage />} />
                
                {/* Private Routes (usuarios autenticados) */}
                <Route element={<PrivateRoute />}>
                </Route>
                {/* Agrega la nueva ruta para el panel de administración */}
                <Route path="/admin/pedidos" element={<OrderManagementPage />} />
                           
            </Routes>
            </Router>
          </Elements>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;