import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from "./pages/AuthPage.jsx";
import Home from "./pages/Home.jsx";
import NotificationDashboard from "./pages/NotificationDashboard.jsx"
import AdminOrders from "./components/catalog/AdminOrders.jsx";// Ajusta el path si está en otra carpeta

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/:action" element={<AuthPage />} />
        <Route path="/dashboardNotification" element={<NotificationDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>
    </Router>
  );
};

export default App;