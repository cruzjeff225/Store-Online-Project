import { useEffect, useState } from "react";
import axios from "axios";

const CartSummary = () => {
    const [total, setTotal] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [iva, setIva] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:5000/api/cart")
            .then(res => {
                setSubtotal(res.data.subtotal);
                setIva(res.data.iva);
                setTotal(res.data.total);
            })
            .catch(err => console.error("Error al obtener el carrito:", err));
    }, []);

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Resumen de compra</h2>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>IVA (10%): ${iva.toFixed(2)}</p>
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        </div>
    );
};

export default CartSummary;
