import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/orders');
        setOrders(res.data);
      } catch (error) {
        console.error('Error cargando pedidos:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List</h2>
      {orders.map((order, index) => (
        <div
          key={index}
          className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800"
        >
          <div className="flex gap-5">
            <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />
            <div className="flex flex-col justify-center">
              <p className="font-medium">
                {order.productName} <span className={`text-indigo-500 ${order.quantity < 2 && "hidden"}`}>x {order.quantity}</span>
              </p>
            </div>
          </div>

          <div className="text-sm">
            <p className="font-medium mb-1">{order.userName}</p>
            <p>{order.address}</p>
          </div>

          <p className="font-medium text-base my-auto text-black/70">${order.totalPrice}</p>

          <div className="flex flex-col text-sm">
            <p>Method: {order.paymentMethod}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;