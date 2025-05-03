import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllCategorias } from '../../api/productApi';

const CategoryList = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getAllCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  // Detecta la categoría activa basada en la URL
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'categoria' && pathParts[2]) {
      setActiveCategory(pathParts[2]);
    } else {
      setActiveCategory(null);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
        Categorías
      </h2>
      <ul className="space-y-1">
        {categorias.map((categoria) => (
          <li key={categoria.id_categoria}>
            <Link
              to={`/categoria/${categoria.id_categoria}`}
              className={`
                block px-3 py-2 rounded-md transition-all
                ${activeCategory === categoria.id_categoria.toString()
                  ? 'bg-blue-100 text-blue-700 font-medium border-l-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center">
                <span className="truncate">{categoria.nombre_categoria}</span>
                {activeCategory === categoria.id_categoria.toString() && (
                  <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {categoria.product_count || ''}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;