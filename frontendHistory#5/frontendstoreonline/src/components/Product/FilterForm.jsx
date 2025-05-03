import React, { useEffect, useState } from 'react';
import { getAllCategorias } from '../../api/productApi';

const FilterForm = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    precio_min: '',
    precio_max: '',
    marca: '',
    id_categoria: '',
  });
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getAllCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();

    // Crear un objeto con los filtros no vacíos
    const activeFilters = {};
    if (filters.precio_min) activeFilters.precio_min = filters.precio_min;
    if (filters.precio_max) activeFilters.precio_max = filters.precio_max;
    if (filters.marca) activeFilters.marca = filters.marca;
    if (filters.id_categoria) activeFilters.id_categoria = filters.id_categoria;

    // Llamar a la función onFilter con los filtros activos
    onFilter(activeFilters);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <form onSubmit={handleFilter} className="mb-8">
      <input
        type="number"
        name="precio_min"
        placeholder="Precio mínimo"
        value={filters.precio_min}
        onChange={handleChange}
        className="mr-2 p-2 border rounded"
      />
      <input
        type="number"
        name="precio_max"
        placeholder="Precio máximo"
        value={filters.precio_max}
        onChange={handleChange}
        className="mr-2 p-2 border rounded"
      />
      <input
        type="text"
        name="marca"
        placeholder="Marca"
        value={filters.marca}
        onChange={handleChange}
        className="mr-2 p-2 border rounded"
      />
      <select
        name="id_categoria"
        value={filters.id_categoria}
        onChange={handleChange}
        className="mr-2 p-2 border rounded"
      >
        <option value="">Selecciona una categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id_categoria} value={categoria.id_categoria}>
            {categoria.nombre_categoria}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Filtrar
      </button>
    </form>
  );
};

export default FilterForm;