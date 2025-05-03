const StatsCards = ({ stats }) => {
    const formatNumber = (num) => {
      return new Intl.NumberFormat('es-ES').format(num);
    };
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Pedidos Totales</h3>
          <p className="text-2xl font-semibold">{formatNumber(stats.total_pedidos)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Ingresos (30 días)</h3>
          <p className="text-2xl font-semibold">${formatNumber(stats.ingresos_totales.toFixed(2))}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Pendientes</h3>
          <p className="text-2xl font-semibold">{formatNumber(stats.pendientes)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
          <h3 className="text-sm font-medium text-gray-500">Entregados</h3>
          <p className="text-2xl font-semibold">{formatNumber(stats.entregados)}</p>
        </div>
      </div>
    );
  };
  
  export default StatsCards;