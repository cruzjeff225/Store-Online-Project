import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { loginUser } from '../../api/userApi';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await loginUser({ correo: email, contrasena: password });
      
      // Verifica que la respuesta tenga token
      if (!response || !response.token) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      // Llama a login con toda la respuesta
      login(response);
      
      // Redirige
      const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';
      navigate(redirectTo);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block mb-1">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        <div className="text-center pt-2">
          <Link 
            to="/auth/forgot-password" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="text-center text-sm">
          ¿No tienes cuenta?{' '}
          <Link 
            to="/auth/register" 
            className="text-blue-600 hover:text-blue-800"
          >
            Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;