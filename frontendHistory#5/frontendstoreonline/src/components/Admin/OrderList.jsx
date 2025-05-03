import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import Pagination from '../../Common/Pagination';

const statusColors = {
  Pendiente: 'bg-yellow-100 text-yellow-800',
  Procesando: 'bg-blue-100 text-blue-800',
  Enviado: 'bg-indigo-100 text-indigo-800',
  Entregado: 'bg-green-100 text-green-800',
  Cancelado: 'bg-red-100 text-red-800'
};

const OrderList = ({ orders, loading, onStatusUpdate, onOrderSelect, pagination, onPageChange }) => {
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await onStatusUpdate(orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay pedidos registrados
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id_pedido} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id_pedido}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.fecha_pedido ? format(new Date(order.fecha_pedido), 'PPpp', { locale: es }) : 'Fecha no disponible'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.nombre_cliente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof order.total === 'number' ? `$${order.total.toFixed(2)}` : 'Total no disponible'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.estado}
                    onChange={(e) => handleStatusChange(order.id_pedido, e.target.value)}
                    disabled={updatingOrder === order.id_pedido}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.estado] || 'bg-gray-100 text-gray-800'
                    } ${updatingOrder === order.id_pedido ? 'opacity-50' : ''}`}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Procesando">Procesando</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => onOrderSelect(order)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={pagination.page}
        totalPages={Math.ceil(pagination.total / pagination.limit)}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default OrderList;