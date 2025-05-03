import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const OrderDetailsModal = ({ isOpen, onClose, order, onStatusUpdate }) => {
  if (!isOpen || !order) return null;

  // Función para formatear valores numéricos
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `$${num.toFixed(2)}`;
  };

  // Obtener información del cliente (usando ambos posibles campos)
  const clienteNombre = order.nombre_cliente || order.nombre || 'No disponible';
  const clienteCorreo = order.correo_cliente || order.correo || 'No disponible';
  const clienteTelefono = order.telefono || 'No disponible';
  const direccionEnvio = order.direccion || order.envio?.direccion_envio || 'No disponible';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800">
              Detalles del Pedido #{order.id_pedido}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resumen del Pedido */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Fecha:</span> {order.fecha_pedido ? format(new Date(order.fecha_pedido), 'PPpp', { locale: es }) : 'Fecha no disponible'}</p>
                <p>
                  <span className="font-medium">Estado:</span>
                  <select
                    value={order.estado}
                    onChange={(e) => onStatusUpdate(order.id_pedido, e.target.value)}
                    className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Procesando">Procesando</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </p>
                <p><span className="font-medium">Total:</span> {formatCurrency(order.total)}</p>
                <p><span className="font-medium">Método de Entrega:</span> {order.metodo_entrega || 'No especificado'}</p>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Información del Cliente</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Nombre:</span> {clienteNombre}</p>
                <p><span className="font-medium">Correo:</span> {clienteCorreo}</p>
                <p><span className="font-medium">Teléfono:</span> {clienteTelefono}</p>
                <p><span className="font-medium">Dirección:</span> {direccionEnvio}</p>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <tr key={item.id_detalle_pedido}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.imagen_url && (
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={item.imagen_url} alt={item.nombre} />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.nombre}</div>
                              <div className="text-sm text-gray-500">{item.marca}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.precio)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.cantidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No hay productos en este pedido
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Información de Pago y Envío */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información de Pago */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Información de Pago</h3>
              {order.pago ? (
                <div className="space-y-2">
                  <p><span className="font-medium">Método:</span> {order.pago.nombre_metodo || 'No especificado'}</p>
                  <p><span className="font-medium">Estado:</span> {order.pago.estado_pago || 'No especificado'}</p>
                  <p><span className="font-medium">Fecha:</span> {order.pago.fecha_pago ? format(new Date(order.pago.fecha_pago), 'PPpp', { locale: es }) : 'Fecha no disponible'}</p>
                  <p><span className="font-medium">Monto:</span> {formatCurrency(order.pago.monto_pago)}</p>
                </div>
              ) : (
                <p className="text-gray-500">No hay información de pago disponible</p>
              )}
            </div>

            {/* Información de Envío */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Información de Envío</h3>
              {order.envio ? (
                <div className="space-y-2">
                  <p><span className="font-medium">Empresa:</span> {order.envio.empresa_envio || 'No especificado'}</p>
                  <p><span className="font-medium">Estado:</span> {order.envio.estado_envio || 'No especificado'}</p>
                  {order.envio.fecha_envio && (
                    <p><span className="font-medium">Fecha de envío:</span> {format(new Date(order.envio.fecha_envio), 'PPpp', { locale: es })}</p>
                  )}
                  {order.envio.fecha_entrega_estimada && (
                    <p><span className="font-medium">Entrega estimada:</span> {format(new Date(order.envio.fecha_entrega_estimada), 'PPpp', { locale: es })}</p>
                  )}
                  {order.envio.fecha_entrega_real && (
                    <p><span className="font-medium">Entrega real:</span> {format(new Date(order.envio.fecha_entrega_real), 'PPpp', { locale: es })}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No hay información de envío disponible</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;