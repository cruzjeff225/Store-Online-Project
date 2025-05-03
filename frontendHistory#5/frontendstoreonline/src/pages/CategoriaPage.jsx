import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductosByCategoria } from '../api/productApi';
import ProductCard from '../Components/Product/ProductCard';

const CategoriaPage = () => {
  const { id_categoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductosByCategoria(id_categoria);
        setProductos(data);
      } catch (error) {
        setError('Error al cargar los productos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [id_categoria]);

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-4">Productos de la categoría</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto.id_producto} producto={producto} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategoriaPage;