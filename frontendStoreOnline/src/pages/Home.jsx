import React from 'react';
import {Link} from 'react-router-dom';
import ProductList from '../components/catalog/ProductList.jsx'

const Home = () => {
    return (
        <div>
            <h1>Bienvenido a StoreOnline</h1>
            <p>Explora nuestros productos y ofertas</p>
            <Link to="/auth/register">
            <button>Registrate</button>
            </Link>
            <Link to="/auth/login">
            <button>Inicia Sesión</button>
            </Link>
            <Link to="/cart" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Ver Carrito
      </Link>

        <ProductList />
            
        </div>
    );
};

export default Home;