import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { paymentApi } from '../api/paymentApi';

const OrderConfirmationPage = () => {
  const { paymentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Para evitar actualizaciones en componentes desmontados
    const controller = new AbortController(); // Para cancelar la solicitud
  
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validación mejorada del ID
        if (!paymentId || isNaN(Number(paymentId))) {
          throw {
            message: 'ID de pago no válido',
            status: 400,
            suggestion: 'Verifique la URL'
          };
        }
  
        console.log('Iniciando solicitud para paymentId:', paymentId);
        const startTime = Date.now();
        
        const response = await paymentApi.getPaymentDetails(paymentId);
        
        console.log('Respuesta recibida en:', Date.now() - startTime, 'ms');
        
        if (!isMounted) return; // No actualizar si el componente se desmontó
  
        if (!response) {
          throw {
            message: 'No se recibieron datos del servidor',
            status: 204
          };
        }
  
        setPaymentDetails(response);
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Error en fetchPaymentDetails:', {
          error: err,
          paymentId,
          time: new Date().toISOString()
        });
        
        setError({
          message: err.message || 'Error al cargar detalles',
          details: err.details || `ID: ${paymentId}`,
          status: err.status || 500,
          suggestion: err.suggestion || 'Intente recargar la página'
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    if (user && paymentId) {
      fetchPaymentDetails();
    } else if (!user) {
      navigate(`/auth/login?redirect=/orden/${paymentId}`);
    }
  
    return () => {
      isMounted = false;
      controller.abort(); // Cancelar la solicitud al desmontar
    };
  }, [user, paymentId, navigate]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p>Cargando detalles del pago...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Error al cargar el pago</h2>
          <p className="mb-2">{error.message}</p>
          {error.details && <p className="text-sm text-gray-600 mb-2">{error.details}</p>}
          {error.suggestion && <p className="text-sm text-blue-600 mb-4">{error.suggestion}</p>}
          <button
            onClick={() => navigate('/')}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Pago no encontrado</h2>
          <p className="mb-6">No se encontraron detalles para el pago #{paymentId}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="text-center mb-6">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">¡Gracias por tu compra!</h1>
          <p className="text-lg">Tu transacción ha sido confirmada</p>
          <div className="mt-4 space-y-1">
            <p className="text-gray-600">Transacción: #{paymentDetails.id_pago}</p>
            <p className="text-gray-600">Pedido: #{paymentDetails.id_pedido}</p>
          </div>
        </div>
        
        <div className="border-t border-b py-6 my-6">
          <h2 className="text-xl font-semibold mb-4">Resumen del Pago</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Estado del Pago:</span>
              <span className={`font-medium capitalize ${
                paymentDetails.estado_pago.toLowerCase() === 'completado' ? 'text-green-600' : 
                paymentDetails.estado_pago.toLowerCase() === 'pendiente' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {paymentDetails.estado_pago.toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Método de Pago:</span>
              <span className="font-medium capitalize">{paymentDetails.nombre_metodo.toLowerCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-bold">${Number(paymentDetails.total_pedido).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fecha:</span>
              <span>{new Date(paymentDetails.fecha_pago).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado del Envío</h2>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              paymentDetails.estado_envio.toLowerCase() === 'preparando' ? 'bg-yellow-500' :
              paymentDetails.estado_envio.toLowerCase() === 'en camino' ? 'bg-blue-500' :
              paymentDetails.estado_envio.toLowerCase() === 'entregado' ? 'bg-green-500' : 'bg-gray-500'
            }`}></div>
            <span className="capitalize">{paymentDetails.estado_envio.toLowerCase()}</span>
          </div>
          {paymentDetails.direccion_envio && (
            <div className="mt-4">
              <p className="font-medium">Dirección de envío:</p>
              <p className="text-gray-700 mt-1 p-3 bg-gray-50 rounded">{paymentDetails.direccion_envio}</p>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Volver a la tienda
          </button>
          <button
            onClick={() => navigate(`/pedidos/${paymentDetails.id_pedido}/seguimiento`)}
            className="inline-block ml-4 bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
          >
            Seguir mi pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;