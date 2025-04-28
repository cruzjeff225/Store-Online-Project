import { useEffect, useState } from 'react';
import axios from 'axios';

const EmailToggle = ({ userId }) => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
        setEnabled(response.data.recibirCorreos === true || response.data.recibirCorreos === 1);
        setError(null);
      } catch (err) {
        console.error('Error al obtener preferencias:', err);
        setError('No se pudieron cargar las preferencias');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, [userId]);

  const handleToggle = async () => {
    const newValue = !enabled;
    setEnabled(newValue); // Optimistic update
    
    try {
      await axios.put(`http://localhost:3000/api/users/preferencia-correo/${userId}`, {
        recibirCorreos: newValue
      });
      setError(null);
    } catch (err) {
      console.error('Error al actualizar preferencias:', err);
      setEnabled(!newValue); // Revert if error
      setError('No se pudo guardar la preferencia');
    }
  };

  if (loading) return <div>Cargando preferencias...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="my-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <div className="relative">
          <input 
            type="checkbox" 
            className="sr-only" 
            checked={enabled} 
            onChange={handleToggle} 
          />
          <div className={`block w-10 h-6 rounded-full ${enabled ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${enabled ? 'transform translate-x-4' : ''}`}></div>
        </div>
        <span className="text-gray-700">Recibir notificaciones por correo electrónico</span>
      </label>
    </div>
  );
};

export default EmailToggle;