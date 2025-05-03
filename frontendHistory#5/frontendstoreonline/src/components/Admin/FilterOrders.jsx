import { useState } from 'react';

const FilterOrders = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Procesando', label: 'Procesando' },
    { value: 'Enviado', label: 'Enviado' },
    { value: 'Entregado', label: 'Entregado' },
    { value: 'Cancelado', label: 'Cancelado' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Filtrar Pedidos</h3>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              id="status"
              name="status"
              value={localFilters.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              value={localFilters.dateFrom}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input
              type="date"
              id="dateTo"
              name="dateTo"
              value={localFilters.dateTo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input
                type="text"
                id="search"
                name="search"
                placeholder="ID, cliente..."
                value={localFilters.search}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Filtrar
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterOrders;