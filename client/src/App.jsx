import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Home from "./pages/Home";
// import AllCakesPage from "./pages/AllCakesPage";
// import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/cakes" element={<AllCakesPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} /> */}
          <Route path="/admin/dashboard" element={<AdminPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
