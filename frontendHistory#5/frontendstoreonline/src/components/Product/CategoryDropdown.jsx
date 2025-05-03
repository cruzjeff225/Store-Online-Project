import React, { useEffect, useState } from 'react';
import { getAllCategorias } from '../../api/productApi';

const CategoryDropdown = () => {
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

  return (
    <div className="category-dropdown">
      <select onChange={(e) => window.location.href = `/categoria/${e.target.value}`}>
        <option value="">Selecciona una categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id_categoria} value={categoria.id_categoria}>
            {categoria.nombre_categoria}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;