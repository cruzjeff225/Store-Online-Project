import { useState, useEffect } from "react";
import { getProducts, filterProducts } from "../../api/productAPI.js";
import { addToCart } from "../../api/cartAPI.js";
import SearchBar from "./SearchBar.jsx";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [cartMessage, setCartMessage] = useState('');

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

    const handleAddToCart = async (idProducto) => {
        const idUsuario = 1;
        const cantidadProducto = 1;

        const response = await addToCart(idUsuario, idProducto, cantidadProducto);
        setCartMessage(response.message);

        setTimeout(() => setCartMessage(''), 3000);
    };

    const handleFilter = async (category) => {
        if (category) {
            const filtered = await filterProducts(category);
            setProducts(filtered);
        } else {
            const allProducts = await getProducts();
            setProducts(allProducts);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-screen-xl mx-auto p-6">
                <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-6">
                    Productos
                </h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
    
                <div className="flex justify-center mb-6">
                    <SearchBar setProducts={setProducts} />
                </div>
    
                <div className="flex justify-center mb-6">
                    <select
                        onChange={(e) => handleFilter(e.target.value)}
                        className="border rounded-md p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="Todas las categorias">Todas las categorías</option>
                        <option value="Alimenticios">Alimenticios</option>
                        <option value="Bebidas">Bebidas</option>
                        <option value="Higiene">Higiene</option>
                        <option value="Belleza">Belleza</option>
                        <option value="Ropa">Ropa</option>
                    </select>
                </div>
    
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <li
                            key={product.idProducto}
                            className="border border-gray-300 rounded-lg shadow-md bg-white p-5 flex flex-col justify-between hover:shadow-lg hover:scale-105 transition-transform"
                        >
                            <div className="group cursor-pointer flex items-center justify-center">
                                <img
                                    className="h-32 w-32 object-contain group-hover:scale-105 transition-transform"
                                    src={product.image}
                                    alt={product.nombreProducto}
                                />
                            </div>
                            <div className="text-gray-500 text-sm mt-4">
                                <p className="text-indigo-500 font-semibold">
                                    {product.categoriaProducto}
                                </p>
                                <p className="text-gray-700 font-medium text-lg truncate">
                                    {product.nombreProducto}
                                </p>
                                <p className="text-gray-500 font-semibold">
                                    {product.descripcionProducto}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    {Array(5)
                                        .fill("")
                                        .map((_, i) => (
                                            product.rating > i ? (
                                                <svg
                                                    key={i}
                                                    width="14"
                                                    height="13"
                                                    viewBox="0 0 18 17"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                                                        fill="#615fff"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    key={i}
                                                    width="14"
                                                    height="13"
                                                    viewBox="0 0 18 17"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z"
                                                        fill="#615fff"
                                                        fillOpacity="0.35"
                                                    />
                                                </svg>
                                            )
                                        ))}
                                </div>
                                <div className="flex items-end justify-between mt-4">
                                    <p className="text-indigo-500 font-bold text-lg">
                                        ${product.precio}{" "}
                                        <span className="text-gray-400 line-through text-sm">
                                            ${product.offerPrice}
                                        </span>
                                    </p>
                                    <button
                                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                                        onClick={() => handleAddToCart(product.idProducto)}
                                    >
                                        Añadir al carrito
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductList;