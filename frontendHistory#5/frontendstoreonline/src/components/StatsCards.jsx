import React from 'react';

const StatsCards = ({ stats }) => {
  // Valores por defecto para evitar errores
  const safeStats = stats || {
    total_pedidos: 0,
    ingresos_totales: 0,
    pendientes: 0,
    entregados: 0
  };

  // Función para formatear números de manera segura
  const formatNumber = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    return new Intl.NumberFormat('es-ES').format(num);
  };

  // Función para formatear moneda de manera segura
  const formatCurrency = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
        <h3 className="text-sm font-medium text-gray-500">Pedidos Totales</h3>
        <p className="text-2xl font-semibold">{formatNumber(safeStats.total_pedidos)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-500">Ingresos (30 días)</h3>
        <p className="text-2xl font-semibold">{formatCurrency(safeStats.ingresos_totales)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
        <h3 className="text-sm font-medium text-gray-500">Pendientes</h3>
        <p className="text-2xl font-semibold">{formatNumber(safeStats.pendientes)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
        <h3 className="text-sm font-medium text-gray-500">Entregados</h3>
        <p className="text-2xl font-semibold">{formatNumber(safeStats.entregados)}</p>
      </div>
    </div>
  );
};

export default StatsCards;