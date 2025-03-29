import React from 'react';
import {Link} from 'react-router-dom';

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
        </div>
    );
};

export default Home;