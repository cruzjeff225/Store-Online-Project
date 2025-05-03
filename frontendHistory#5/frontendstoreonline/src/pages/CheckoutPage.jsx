import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { paymentApi } from '../api/paymentApi';
import PayPalButton from '../Components/Payment/PayPalButton';
import StripeCardForm from '../Components/Payment/StripeCardForm';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState('');

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await paymentApi.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (err) {
        if (err.status === 401) {
          navigate('/auth/login?redirect=/checkout');
        } else {
          setError(err.message || 'Error al cargar métodos de pago');
        }
      }
    };
    
    loadPaymentMethods();
    
    if (user?.direccion) {
      setShippingAddress(user.direccion);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (cart.items.length === 0 && !cart.loading) {
      navigate('/carrito');
    }
  }, [cart, navigate]);

  const handlePayment = async (paymentDetails = {}) => {
    setError(null);
    setSuccess(null);
    setIsProcessing(true);
    
    try {
      if (!selectedMethod) {
        throw new Error('Por favor selecciona un método de pago');
      }
  
      if (!shippingAddress.trim()) {
        throw new Error('La dirección de envío es requerida');
      }

      const paymentData = {
        id_usuario: user.id_usuario,
        id_metodo: selectedMethod.id_metodo,
        direccion_envio: shippingAddress,
        metodo_entrega: shippingMethod,
        ...paymentDetails
      };

      const result = await paymentApi.processPayment(paymentData);
      
      if (!result?.success) {
        throw new Error(result?.message || 'El pago no fue procesado correctamente');
      }

      await paymentApi.vaciarCarrito(user.id_usuario);
      
      setSuccess({
        title: '¡Pago exitoso!',
        message: result.message || 'Tu pedido ha sido procesado correctamente.',
        paymentId: result.pago?.id_pago || 'N/A'
      });

      setTimeout(() => {
        navigate(`/orden/${result.pago.id_pago}`);
      }, 3000);
    } catch (err) {
      console.error('Error al procesar pago:', err);
      setError(err.response?.data?.message || err.message || 'Ocurrió un error al procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) return <Navigate to="/auth/login?redirect=/checkout" replace />;
  if (cart.loading) return <div className="text-center py-8">Cargando carrito...</div>;
  if (cart.error) return <div className="text-center text-red-500 py-8">{cart.error}</div>;
  if (cart.items.length === 0) return <Navigate to="/carrito" replace />;

  return (
    <div className="checkout-page container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="checkout-form md:w-2/3">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Información de Envío</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Dirección de Envío *</label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                  placeholder="Ingresa la dirección completa de envío"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Método de Envío *</label>
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="standard">Envío Estándar (3-5 días)</option>
                  <option value="express">Envío Express (1-2 días)</option>
                  <option value="pickup">Recoger en tienda</option>
                </select>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
              
              {!selectedMethod && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Por favor selecciona un método de pago para continuar.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id_metodo} 
                      className={`payment-method-card p-4 border rounded-lg cursor-pointer ${
                        selectedMethod?.id_metodo === method.id_metodo ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedMethod(method)}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`method-${method.id_metodo}`}
                          name="paymentMethod"
                          checked={selectedMethod?.id_metodo === method.id_metodo}
                          onChange={() => setSelectedMethod(method)}
                          className="mr-3"
                        />
                        <div>
                          <label htmlFor={`method-${method.id_metodo}`} className="font-medium text-gray-800">
                            {method.nombre_metodo}
                          </label>
                          {method.descripcion && (
                            <p className="text-sm text-gray-600 mt-1">{method.descripcion}</p>
                          )}
                          {method.comision > 0 && (
                            <p className="text-sm text-red-600 mt-1">
                              Comisión: {method.comision}%
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {selectedMethod?.id_metodo === method.id_metodo && (
                        <div className="mt-3 pl-7">
                          {method.codigo_metodo === 'tarjeta' && stripeClientSecret ? (
                            <StripeCardForm
                              clientSecret={stripeClientSecret}
                              onSuccess={handlePayment}
                              onError={(err) => setError(err.message)}
                            />
                          ) : method.codigo_metodo === 'tarjeta' && (
                            <div className="text-gray-500 text-sm">Cargando formulario de pago...</div>
                          )}
                          
                          {method.codigo_metodo === 'paypal' && (
                            <div className="mt-4">
                              <PayPalButton
                                amount={cart.total}
                                onSuccess={(details) => handlePayment({ paypal_payment_id: details.id })}
                                onError={(err) => setError(`Error en PayPal: ${err.message}`)}
                              />
                            </div>
                          )}
                          
                          {method.codigo_metodo === 'efectivo' && (
                            <div className="bg-green-50 p-3 rounded text-sm text-green-800 mt-3">
                              Pagarás en efectivo cuando recibas tu pedido
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {error ? 'Error al cargar métodos de pago' : 'Cargando métodos de pago...'}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="checkout-summary md:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Tu Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.id_detalle} className="flex items-start gap-3 border-b pb-4">
                  <img 
                    src={item.imagen_url || '/placeholder-product.png'} 
                    alt={item.nombre} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{item.nombre}</h3>
                    <p className="text-sm text-gray-600">
                      {item.cantidad} x ${Number(item.precio).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>${Number(cart.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>IVA (13%):</span>
                <span>${Number(cart.iva || 0).toFixed(2)}</span>
              </div>
              {selectedMethod?.comision > 0 && (
                <div className="flex justify-between mb-2 text-red-600">
                  <span>Comisión ({selectedMethod.comision}%):</span>
                  <span>${(Number(cart.total) * selectedMethod.comision / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total:</span>
                <span>
                  ${(
                    Number(cart.total) + 
                    (selectedMethod?.comision > 0 ? Number(cart.total) * selectedMethod.comision / 100 : 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            
            {selectedMethod && !['tarjeta', 'paypal'].includes(selectedMethod.codigo_metodo) && (
              <button
                onClick={() => handlePayment()}
                disabled={isProcessing || !shippingAddress.trim()}
                className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium ${
                  isProcessing || !shippingAddress.trim() 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-md">
          <div className="flex justify-between items-start">
            <p className="mr-4">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">{success.title}</h3>
            <p className="mb-4">{success.message}</p>
            <p className="text-sm text-gray-600">
              ID de transacción: #{success.paymentId}
            </p>
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: '100%', animation: 'progress 3s linear forwards' }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Serás redirigido automáticamente...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;