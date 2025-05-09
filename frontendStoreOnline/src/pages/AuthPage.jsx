import React, { useState } from "react";
import { Link, useParams } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm';

const AuthPage = () => {
    const {action} = useParams();

    return (
        <div>
            {action === 'register' && <RegisterForm />}
            {action === 'login' && <LoginForm />}
            <Link to="/">
            <button>Volver a la página principal</button>
            </Link>
        </div>
    );
};

export default AuthPage;
