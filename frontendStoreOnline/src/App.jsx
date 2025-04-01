import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from "./pages/AuthPage.jsx";
import Home from "./pages/Home.jsx";
import CartPage from "./pages/CartPage.jsx";
import CartSummary from "./components/CartSummary";  
import ProductList from "./components/ProductList.jsx/index.js";  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/:action" element={<AuthPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>

      {/* Agregamos los nuevos componentes aquí sin modificar el código anterior */}
      <div className="max-w-lg mx-auto mt-10">
        <ProductList />
        <CartSummary />
      </div>

    </Router>
  );
};

export default App;
