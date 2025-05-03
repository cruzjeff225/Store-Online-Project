import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { filterProductos, getAllProductos } from '../api/productApi';
import Footer from '../Components/Layout/Footer';
import Header from '../Components/Layout/Header';
import CategoryList from '../Components/Product/CategoryList';
import FilterForm from '../Components/Product/FilterForm';
import ProductCard from '../Components/Product/ProductCard';

const HomePage = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasProducts, setHasProducts] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getAllProductos();
        setProductos(data);
        setFilteredProductos(data);
        setHasProducts(data.length > 0);
      } catch (error) {
        setError('Error al cargar los productos. Por favor, intenta más tarde.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleFilter = async (activeFilters) => {
    try {
      setLoading(true);
      const data = await filterProductos(activeFilters);
      setFilteredProductos(data);
      setHasProducts(data.length > 0);
      setError(null);
    } catch (error) {
      setError('Error al aplicar los filtros');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </main>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-2xl mx-auto">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Por favor verifica tu conexión o intenta nuevamente más tarde.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none"
                >
                  Recargar página
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-800 mb-2">Bienvenido a StoreOnline</h1>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Descubre los mejores productos al mejor precio
          </p>
          <div className="mt-6">
            <Link
              to="/catalogo"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar con filtros */}
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-card">
              <FilterForm onFilter={handleFilter} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-card">
              <CategoryList />
            </div>
          </div>
          
          {/* Lista de productos */}
          <div className="lg:w-3/4">
            {!hasProducts ? (
              <div className="bg-white p-12 rounded-lg shadow-card text-center">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="mt-6 text-2xl font-medium text-gray-900">No hay productos disponibles</h3>
                <p className="mt-2 text-gray-500">
                  {filteredProductos.length === 0 && productos.length === 0
                    ? "Actualmente no tenemos productos en nuestro catálogo."
                    : "No encontramos productos que coincidan con tus filtros."}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setFilteredProductos(productos);
                      setHasProducts(productos.length > 0);
                      // Aquí podrías también resetear los filtros si es necesario
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver todos los productos
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProductos.map((producto) => (
                  <ProductCard key={producto.id_producto} producto={producto} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;