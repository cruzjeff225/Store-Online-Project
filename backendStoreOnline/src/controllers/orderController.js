const { geocodeAddress } = require('../Services/geocodeService');

// Simulación (reemplazar con base de datos)
const orders = [
  {
    id: 1,
    customer: {
      name: "Juan Pérez",
      phone: "12345678",
      address: "Avenida Siempre Viva 123, Ciudad",
    },
    products: [
      { name: "Camisa azul", image: "https://...", quantity: 2 },
      { name: "Pantalón negro", image: "https://...", quantity: 1 },
    ],
    specialInstructions: "Dejar en recepción",
  },
];

const getOrderDetails = async (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" });

  const location = await geocodeAddress(order.customer.address);
  res.json({ ...order, location });
};

module.exports = { getOrderDetails };
Z