import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/:action" element={<AuthPage />} />
      </Routes>
    </Router>
  );
};

export default App;