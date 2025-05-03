import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext'; // Correct import for useAuth
import {
  getCriticalPendingOrders,
  getOrderDetails,
  getOrdersList,
  updateOrderStatus
} from '../api/pedidosApi';
import AlertsSection from '../components/Admin/AlertsSection';
import OrderDetailsModal from '../components/Admin/OrderDetailsModal';
import OrderList from '../components/Admin/OrderList';
import QuickActions from '../components/Admin/QuickActions'; // Nuevo componente
import RecentActivity from '../components/Admin/RecentActivity'; // Nuevo componente
import SidebarMenu from '../components/Admin/SidebarMenu';
import StatsCards from '../components/Admin/StatsCards';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5, // Mostrar menos pedidos en el dashboard
    total: 0
  });

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getOrdersList({ 
        page, 
        limit: pagination.limit,
        sort: 'fecha_pedido:desc' // Ordenar por los más recientes
      });
      
      setOrders(data.pedidos);
      setPagination({
        ...pagination,
        page,
        total: data.pagination.total
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getOrdersList({ stats: true });
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPendingAlerts = async () => {
    try {
      const alerts = await getCriticalPendingOrders();
      setPendingAlerts(alerts);
    } catch (error) {
      console.error('Error fetching pending alerts:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(pagination.page);
      fetchPendingAlerts();
      fetchStats(); // Actualizar estadísticas también
      
      if (selectedOrder && selectedOrder.id_pedido === orderId) {
        const updatedOrder = await getOrderDetails(orderId);
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleOrderSelect = async (order) => {
    try {
      const fullOrderDetails = await getOrderDetails(order.id_pedido);
      setSelectedOrder(fullOrderDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchPendingAlerts();
    
    const interval = setInterval(fetchPendingAlerts, 300000); // Actualizar cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  if (!user || !user.es_admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Restringido</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarMenu />
      
      <div className="ml-64 p-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Resumen Administrativo</h1>
            <p className="text-gray-600">Bienvenido, {user.nombre || 'Administrador'}</p>
          </div>
          <div className="flex space-x-4">
            {/* Botón para ir a la página principal */}
            <button 
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => window.location.href = '/'}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Página Principal
            </button>
            
            <button 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => window.location.href = '/admin/orders'}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Gestión Completa
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Estadísticas Generales</h2>
          {stats ? (
            <StatsCards stats={{
              total_pedidos: stats?.total_orders || 0,
              ingresos_totales: stats?.total_income || 0,
              pendientes: stats?.pending_orders || 0,
              entregados: stats?.delivered_orders || 0
            }} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse h-24"></div>
              ))}
            </div>
          )}
        </div>
        
        {/* Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <AlertsSection 
              alerts={pendingAlerts} 
              onViewOrder={handleOrderSelect}
            />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
        
        {/* Recent Activity and Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Pedidos Recientes</h2>
              </div>
              <OrderList 
                orders={orders} 
                loading={loading}
                onStatusUpdate={handleStatusUpdate}
                onOrderSelect={handleOrderSelect}
                pagination={pagination}
                onPageChange={fetchOrders}
                compact={true}
              />
            </div>
          </div>
          
          <div>
            <RecentActivity />
          </div>
        </div>
        
        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            order={selectedOrder}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;