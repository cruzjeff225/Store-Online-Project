import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProductos } from '../api/productApi';
import { useAuth } from '../Context/AuthContext';

const CatalogoPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [likedProducts, setLikedProducts] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getAllProductos();
        setProductos(data);
      } catch (error) {
        setError('Error al cargar el catálogo de productos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Filtrado de productos
  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Manejar like/dislike
  const handleLike = (productId) => {
    if (!user) {
      navigate('/auth/login?redirect=/catalogo');
      return;
    }
    setLikedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Manejar comentarios
  const handleCommentClick = (productId) => {
    navigate(`/producto/${productId}#comments`);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </main>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col">
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
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-800 mb-4">Catálogo de Productos</h1>
          
          {/* Barra de búsqueda */}
          <div className="max-w-md mx-auto relative mb-8">
            <input
              type="text"
              placeholder="Buscar en el catálogo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-6 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
            <svg className="absolute right-3 top-3 h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Lista de productos */}
        {currentProducts.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontraron productos</h3>
            <p className="mt-2 text-gray-500">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {currentProducts.map((producto) => (
                <div key={producto.id_producto} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Imagen del producto */}
                  <div className="relative h-64 overflow-hidden group">
                    <img
                      src={producto.imagen_url || '/placeholder-product.jpg'}
                      alt={producto.nombre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Botón de like */}
                    <button
                      onClick={() => handleLike(producto.id_producto)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      aria-label={likedProducts[producto.id_producto] ? 'Quitar like' : 'Dar like'}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${likedProducts[producto.id_producto] ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={likedProducts[producto.id_producto] ? 0 : 2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Contenido del producto */}
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{producto.nombre}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        ${producto.precio}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{producto.descripcion}</p>
                    
                    {/* Interacciones */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleCommentClick(producto.id_producto)}
                        className="text-gray-500 hover:text-blue-600 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Comentar
                      </button>
                      <span className="text-gray-400 text-sm">
                        {Math.floor(Math.random() * 50)} likes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 border-t border-b border-gray-300 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CatalogoPage;