import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductoById } from '../api/productApi';
import ProductCard from '../Components/Product/ProductCard';

const ProductPage = () => {
  const { id_producto } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await getProductoById(id_producto);
        setProducto(data);
      } catch (error) {
        setError('Error al cargar el producto');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id_producto]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!producto) return <div>Producto no encontrado</div>;

  return (
    <div>
      <h1>Detalles del Producto</h1>
      <ProductCard producto={producto} />
    </div>
  );
};

export default ProductPage;