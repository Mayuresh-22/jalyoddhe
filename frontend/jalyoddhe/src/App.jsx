import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import NavbarComponent from "./components/Navbar";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import About from "./pages/About";
import Footer from "./components/Footer";
import ChatAgent from "./components/ChatAgent";
import AdminDashboard from "./pages/AdminDashboard";
import ScrollToTop from "./components/ScrollToTop";

function AppContent() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/admin/login";
  const isAboutPage = location.pathname === "/about";
  const isDashboardPage = location.pathname === "/admin/dashboard";

  const hideFooterAndChat = isLoginPage;

  return (
    <div className="relative min-h-screen bg-[#031217] text-white inter-300">

      <ScrollToTop />

      <NavbarComponent
        isLoginPage={isLoginPage || isAboutPage}
        isDashboardPage={isDashboardPage}
      />

      <Routes key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      {/* {!hideFooterAndChat && <ChatAgent />} */}
      {!hideFooterAndChat && <Footer />}
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
