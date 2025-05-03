// src/Pages/AuthPage.jsx
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import ResetPasswordForm from '../Components/Auth/ResetPasswordForm';
import { useAuth } from '../Context/AuthContext';

const AuthPage = () => {
  const { action, token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/';

  // Redirigir si ya está autenticado (excepto para reset-password)
  useEffect(() => {
    if (user && action !== 'reset-password') {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, action, redirectTo]);

  // Validar acciones permitidas
  const validActions = ['login', 'register', 'forgot-password', 'reset-password'];
  if (!validActions.includes(action) && !token) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Acción no válida</h2>
        <p className="mb-4">La página de autenticación solicitada no existe.</p>
        <Link 
          to="/auth/login" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  // Renderizar el formulario apropiado
  const renderForm = () => {
    switch (action) {
      case 'register':
        return <RegisterForm redirectTo={redirectTo} />;
      case 'login':
        return <LoginForm redirectTo={redirectTo} />;
      case 'forgot-password':
        return <ForgotPasswordForm />;
      case 'reset-password':
        return token ? <ResetPasswordForm token={token} /> : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Token inválido</h2>
            <p>El enlace para restablecer contraseña no es válido o ha expirado.</p>
            <Link 
              to="/auth/forgot-password" 
              className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {action === 'register' && 'Crear una cuenta'}
            {action === 'login' && 'Inicia sesión en tu cuenta'}
            {action === 'forgot-password' && 'Recuperar contraseña'}
            {action === 'reset-password' && 'Restablecer contraseña'}
          </h2>
          {action !== 'reset-password' && (
            <p className="mt-2 text-sm text-gray-600">
              {action === 'register' && 'O '}
              {action === 'login' && 'O '}
              {action === 'forgot-password' && 'Ingresa tu email para recibir instrucciones'}
              {action !== 'forgot-password' && (
                <Link
                  to={action === 'register' 
                    ? '/auth/login' 
                    : '/auth/register'}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {action === 'register' 
                    ? 'inicia sesión con tu cuenta existente' 
                    : 'regístrate para una nueva cuenta'}
                </Link>
              )}
            </p>
          )}
        </div>

        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          {renderForm()}
        </div>

        <div className="text-center">
          <Link 
            to="/" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;