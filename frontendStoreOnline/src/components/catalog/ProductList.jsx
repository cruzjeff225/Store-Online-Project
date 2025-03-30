import { useState, useEffect } from "react";
import { getProducts, filterProducts } from "../../api/productAPI.js";
import SearchBar from "./SearchBar.jsx";

const ProductList = () => {
    const[products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts();
                console.log("Productos cargados: ", data);
                if (!Array.isArray(data)) throw new Error("Datos inválidos");
                setProducts(data);
            } catch (error) {
                console.log('Error al cargar prodcutos: ', error);
                setError('Error al cargar productos');
            }
        };
        loadProducts();
    }, []);

    const handleFilter = async (category) => {
        if(category) {
            const filtered = await filterProducts(category);
            setProducts(filtered);
        } else {
            const allProducts = await getProducts();
            setProducts(allProducts);
        }
    };

    return (
        <div>
            <h2>Productos</h2>
            {error && <p>{error}</p>}

            <SearchBar setProducts={setProducts} />

            <select onChange={(e) => handleFilter(e.target.value)}>
                <option value="Todas las categorias">Todas las categorías</option>
                <option value="Alimenticios">Alimenticios</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Higiene">Higiene</option>
                <option value="Belleza">Belleza</option>
                <option value="Ropa">Ropa</option>
            </select>

            <ul>
                {products.map(product => (
                   <li key={product.idProducto}>
                   <h3>{product.nombreProducto}</h3> 
                   <h3>{product.descripcionProducto}</h3> 
                   <h3>Precio: ${product.precio}</h3> 
                   <h3>Unidades disponibles: {product.stock}</h3> 
                   <h3>Categoría: {product.categoriaProducto}</h3> 
                   </li> 
                ))}
            </ul>
        </div>
    );
};

export default ProductList;