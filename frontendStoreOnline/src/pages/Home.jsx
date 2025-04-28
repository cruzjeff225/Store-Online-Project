import React from 'react';
import {Link} from 'react-router-dom';
import NavBar from '../components/common/NavBar.jsx';
import ProductList from '../components/catalog/ProductList.jsx'

const Home = () => {
    return (
        <div>
            <NavBar />
            <h1>Bienvenido a StoreOnline</h1>
            <p>Explora nuestros productos y ofertas</p>
            <Link to="/auth/register">
            <button>Registrate</button>
            </Link>
            <Link to="/auth/login">
            <button>Inicia Sesión</button>
            </Link>
            <Link to="/dashboardNotification">
            <button>Mis Notificaciones</button>
            </Link>

        <ProductList />
            
        </div>
    );
};

export default Home;