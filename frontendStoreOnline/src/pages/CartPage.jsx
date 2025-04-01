import React, { useState } from "react";

function CartPage() {
  // Estado del carrito con productos de ejemplo
  const [cart, setCart] = useState([
    { id: 1, name: "Producto 1", price: 20, quantity: 1 },
    { id: 2, name: "Producto 2", price: 15, quantity: 2 },
  ]);

  // Calcular total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id} className="flex justify-between border-b py-2">
            <span>{item.name} (x{item.quantity})</span>
            <span>${item.price * item.quantity}</span>
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-bold mt-4">Total: ${total}</h3>
    </div>
  );
}

export default CartPage;
