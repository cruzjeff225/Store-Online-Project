// src/Components/Payment/PayPalButton.jsx
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from 'react';

const PayPalButton = ({ amount, currency = "USD", onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <PayPalScriptProvider 
      options={{ 
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "TU_CLIENT_ID_DE_PAYPAL",
        currency: currency,
        intent: "capture",
        components: "buttons"
      }}
    >
      <PayPalButtons
        style={{ 
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "pay",
          height: 40
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toString(),
                currency_code: currency,
                breakdown: {
                  item_total: {
                    value: amount.toString(),
                    currency_code: currency
                  }
                }
              }
            }],
            application_context: {
              shipping_preference: "NO_SHIPPING"
            }
          });
        }}
        onApprove={(data, actions) => {
          setIsProcessing(true);
          return actions.order.capture().then((details) => {
            onSuccess(details);
          }).catch(err => {
            onError(err);
          }).finally(() => {
            setIsProcessing(false);
          });
        }}
        onError={(err) => {
          onError(err);
        }}
        onCancel={(data) => {
          onError(new Error('Pago cancelado por el usuario'));
        }}
      />
      {isProcessing && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Por favor completa el proceso en la ventana de PayPal...
        </div>
      )}
    </PayPalScriptProvider>
  );
};

export default PayPalButton;