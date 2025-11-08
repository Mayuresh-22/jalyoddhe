import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavbarComponent from "./components/Navbar";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import About from "./pages/About";
import Footer from "./components/Footer";
import ChatAgent from "./components/ChatAgent";

function AppContent() {
  const location = useLocation();

  // Page checks
  const isLoginPage = location.pathname === "/admin/login";
  const isAboutPage = location.pathname === "/about";

  return (
    <div className="relative min-h-screen bg-[#031217] text-white inter-300">
      {/* Navbar */}
      <NavbarComponent isLoginPage={isLoginPage || isAboutPage} />

      {/* Page Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {/* Floating Chat (hide on login/about) */}
      {!isLoginPage && !isAboutPage && <ChatAgent />}

      {/* Footer (show for Home + About, hide only on Login) */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
