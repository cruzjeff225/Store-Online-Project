import React, { useState } from "react";
import { Link, useParams } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
    const {action} = useParams();

    return (
        <div>
            {action === 'register' && <RegisterForm />}
            <Link to="/">
            <button>Volver a la página principal</button>
            </Link>
        </div>
    );
};

export default AuthPage;

