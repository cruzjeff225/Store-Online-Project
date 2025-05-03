import {
  FaBell,
  FaBoxOpen,
  FaChartLine,
  FaCog,
  FaHome,
  FaMoneyBillWave,
  FaShoppingBag,
  FaTruck,
  FaUsers
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
  
  const SidebarMenu = () => {
    return (
      <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 p-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-8 text-gray-800 flex items-center">
          <svg className="w-8 h-8 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
          </svg>
          Admin Panel
        </h2>
        
        <nav className="space-y-1">
          <NavLink 
            to="/dashboard" 
            className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FaHome className="mr-3 text-lg" />
            Resumen
          </NavLink>
          
          <NavLink 
            to="/admin/orders" 
            className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FaBoxOpen className="mr-3 text-lg" />
            Gestión de Pedidos
          </NavLink>
          
          <NavLink 
            to="/admin/products" 
            className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FaShoppingBag className="mr-3 text-lg" />
            Productos
          </NavLink>
          
          <NavLink 
            to="/admin/users" 
            className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FaUsers className="mr-3 text-lg" />
            Usuarios
          </NavLink>
          
          <NavLink 
            to="/admin/notifications" 
            className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FaBell className="mr-3 text-lg" />
            Notificaciones
          </NavLink>
          
          <NavLink 
            to="/admin/payments" 
            className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FaMoneyBillWave className="mr-3 text-lg" />
            Pagos
          </NavLink>
          
          <NavLink 
            to="/admin/shipping" 
            className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FaTruck className="mr-3 text-lg" />
            Envíos
          </NavLink>
          
          <NavLink 
            to="/admin/reports" 
            className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FaChartLine className="mr-3 text-lg" />
            Reportes
          </NavLink>
          
          <NavLink 
            to="/admin/settings" 
            className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FaCog className="mr-3 text-lg" />
            Configuración
          </NavLink>
        </nav>
      </div>
    );
  };
  
  export default SidebarMenu;