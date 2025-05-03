// src/Components/Payment/StripeCardForm.jsx
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';

const StripeCardForm = ({ clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          // Aquí puedes agregar detalles de facturación si los tienes
        }
      });

      if (stripeError) {
        throw stripeError;
      }

      // Confirmar el pago con Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
          receipt_email: 'customer@example.com', // Reemplaza con el email del usuario
          save_payment_method: false // Cambia a true si quieres guardar el método de pago
        }
      );

      if (confirmError) {
        throw confirmError;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentMethod);
      }
    } catch (err) {
      console.error('Error en Stripe:', err);
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border rounded">
        <CardElement 
          onChange={(e) => setCardComplete(e.complete)}
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true
          }} 
        />
      </div>
      <button 
        type="submit" 
        disabled={!stripe || isProcessing || !cardComplete}
        className={`w-full py-3 px-4 rounded-md text-white font-medium ${
          !stripe || isProcessing || !cardComplete 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
        ) : 'Pagar con Tarjeta'}
      </button>
    </form>
  );
};

export default StripeCardForm;