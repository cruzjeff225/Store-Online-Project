import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { filterProductos, searchProductos } from '../api/productApi';
import ProductCard from '../Components/Product/ProductCard';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let data;
        if (location.pathname === '/buscar') {
          const query = new URLSearchParams(location.search).get('q');
          data = await searchProductos(query);
        } else if (location.pathname === '/filtrar') {
          const filters = location.state;
          data = await filterProductos(filters);
        }

        // Si no hay productos, no es un error, simplemente no hay resultados
        if (!data || data.length === 0) {
          setProductos([]); // Establece productos como un array vacío
        } else {
          setProductos(data);
        }
      } catch (error) {
        // Captura errores de conexión o del backend
        setError('Error al cargar los resultados o el producto no existe. Por favor, verifica tu conexión a internet o intenta más tarde.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [location]);

  const handleGoHome = () => {
    navigate('/'); // Redirige a la página principal
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Resultados</h1>

      {/* Botón para volver a la página principal */}
      <button
        onClick={handleGoHome}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Volver a la página principal
      </button>

      {/* Mensaje de error del backend */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Mensaje cuando no se encuentran productos */}
      {!loading && !error && productos.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p>No se encontraron productos.</p>
        </div>
      )}

      {/* Lista de productos */}
      {!loading && !error && productos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {productos.map((producto) => (
            <ProductCard key={producto.id_producto} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;