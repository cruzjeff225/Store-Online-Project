import React, { useState, useEffect } from "react";
import { getCartCount } from "../../api/cartAPI.js";

const NavBar = () => {
    const [cartCount, setCartCount] = useState(0);
    const idUsuario = 1;

    useEffect(() => {
        const fecthCartCount = async () => {
            const count = await getCartCount(idUsuario);
            setCartCount(count);
        };

        fecthCartCount();
    }, []);

    return (
        <nav>
            <h1>StoreOnline</h1>
            <div className="cart-icon">
                🛒 <span>{cartCount}</span>
            </div>
        </nav>
    );
};

export default NavBar;

