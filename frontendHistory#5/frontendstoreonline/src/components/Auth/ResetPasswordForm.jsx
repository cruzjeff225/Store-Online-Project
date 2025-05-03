import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../api/userApi';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await resetPassword(token, newPassword);
      setMessage('Contraseña restablecida correctamente. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        <div>
          <label htmlFor="newPassword" className="block mb-1">Nueva contraseña:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength="6"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Restablecer Contraseña'}
        </button>

        <div className="text-center pt-2">
          <Link 
            to="/auth/login" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;