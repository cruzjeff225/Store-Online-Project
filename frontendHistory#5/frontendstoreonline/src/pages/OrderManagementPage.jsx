import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // Correct import for useAuth
import {
  getCriticalPendingOrders,
  getOrderDetails,
  getOrdersList,
  updateOrderStatus
} from '../api/pedidosApi';
import AlertsSection from '../components/Admin/AlertsSection';
import FilterOrders from '../components/Admin/FilterOrders';
import OrderDetailsModal from '../components/Admin/OrderDetailsModal';
import OrderList from '../components/Admin/OrderList';
import SidebarMenu from '../components/Admin/SidebarMenu';
import StatsCards from '../components/Admin/StatsCards';

const OrderManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Función para obtener los pedidos con filtros
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit: pagination.limit,
        ...filters,
        sort: 'fecha_pedido:desc' // Mantener ordenamiento por fecha
      };
      
      const data = await getOrdersList(params);
      
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

  // Función para obtener estadísticas
  const fetchStats = async () => {
    try {
      const response = await getOrdersList({ stats: true });
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Función para alertas pendientes
  const fetchPendingAlerts = async () => {
    try {
      const alerts = await getCriticalPendingOrders();
      setPendingAlerts(alerts);
    } catch (error) {
      console.error('Error fetching pending alerts:', error);
    }
  };

  // Actualizar estado de un pedido
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(pagination.page);
      fetchPendingAlerts();
      fetchStats();
      
      if (selectedOrder && selectedOrder.id_pedido === orderId) {
        const updatedOrder = await getOrderDetails(orderId);
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Seleccionar un pedido para ver detalles
  const handleOrderSelect = async (order) => {
    try {
      const fullOrderDetails = await getOrderDetails(order.id_pedido);
      setSelectedOrder(fullOrderDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Actualizar parámetros de URL
    const params = {};
    if (newFilters.status) params.status = newFilters.status;
    if (newFilters.dateFrom) params.dateFrom = newFilters.dateFrom;
    if (newFilters.dateTo) params.dateTo = newFilters.dateTo;
    if (newFilters.search) params.search = newFilters.search;
    
    setSearchParams(params);
  };

  // Efectos iniciales
  useEffect(() => {
    // Leer filtros de URL al cargar
    const params = Object.fromEntries(searchParams.entries());
    const initialFilters = {
      status: params.status || '',
      dateFrom: params.dateFrom || '',
      dateTo: params.dateTo || '',
      search: params.search || ''
    };
    
    setFilters(initialFilters);
    
    // Cargar datos iniciales
    fetchOrders();
    fetchStats();
    fetchPendingAlerts();
    
    // Configurar intervalo para actualizar alertas
    const interval = setInterval(fetchPendingAlerts, 300000);
    return () => clearInterval(interval);
  }, []);

  // Efecto para actualizar cuando cambian los filtros
  useEffect(() => {
    if (filters.status || filters.dateFrom || filters.dateTo || filters.search) {
      fetchOrders();
    }
  }, [filters]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarMenu />
      
      <div className="ml-64 p-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión Completa de Pedidos</h1>
          
          <button 
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Dashboard
          </button>
        </div>
        
        {/* Estadísticas rápidas */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Resumen General</h2>
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
        
        {/* Alertas críticas */}
        <div className="mb-6">
          <AlertsSection 
            alerts={pendingAlerts} 
            onViewOrder={handleOrderSelect}
            compact={true}
          />
        </div>
        
        {/* Filtros */}
        <div className="mb-6">
          <FilterOrders 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        {/* Lista de pedidos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <OrderList 
            orders={orders} 
            loading={loading}
            onStatusUpdate={handleStatusUpdate}
            onOrderSelect={handleOrderSelect}
            pagination={pagination}
            onPageChange={fetchOrders}
            showPagination={true}
            fullView={true}
          />
        </div>
        
        {/* Modal de detalles del pedido */}
        {selectedOrder && (
          <OrderDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            order={selectedOrder}
            onStatusUpdate={handleStatusUpdate}
            fullView={true}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManagementPage;