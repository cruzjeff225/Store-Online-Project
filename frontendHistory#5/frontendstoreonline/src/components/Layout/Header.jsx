import React from 'react';
import { Link } from 'react-router-dom';
import NotificationDropdown from '../../components/Notification/NotificationDropdown';
import { useAuth } from '../../Context/AuthContext';
import CartIcon from '../Cart/CartIcon';
import SearchBar from '../Product/SearchBar';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary-600 text-white py-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4 md:gap-0">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold hover:text-primary-300 transition-colors duration-200">
          StoreOnline
        </Link>
        
        {/* Barra de búsqueda */}
        <div className="w-full md:w-1/3 px-0 md:px-8">
          <SearchBar />
        </div>
        
        {/* Navegación */}
        <nav className="w-auto">
          <ul className="flex items-center space-x-4 md:space-x-6">
            {user ? (
              <>
                <li className="flex items-center space-x-4 md:space-x-6">
                  <span className="text-primary-200 hidden md:inline">
                    Hola, {user.nombre || user.correo.split('@')[0] || 'Usuario'}
                  </span>
                  
                  {user && (
                    <Link 
                      to="/admin/pedidos" 
                      className="hover:text-primary-300 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-primary-700"
                    >
                      Dashboard
                    </Link>
                  )}
                                    
                  <div className="relative">
                    <NotificationDropdown />
                  </div>
                  
                  <CartIcon userId={user.id_usuario} />
                  
                  <button 
                    onClick={logout}
                    className="hover:text-primary-300 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-primary-700"
                  >
                    <span className="hidden md:inline">Cerrar sesión</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/auth/register" className="hover:text-primary-300 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-primary-700">
                    Registrarse
                  </Link>
                </li>
                <li>
                  <Link to="/auth/login" className="hover:text-primary-300 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-primary-700">
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <CartIcon />
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default React.memo(Header);