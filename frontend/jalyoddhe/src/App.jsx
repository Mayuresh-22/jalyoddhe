import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import NavbarComponent from "./components/Navbar";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import Footer from "./components/Footer";
import ChatAgent from "./components/ChatAgent";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  return (
    <div className="relative min-h-screen bg-[#031217] text-white flex flex-col">
      {/* Navbar changes depending on page */}
      <NavbarComponent isLoginPage={isLoginPage} />

      {/* Page Content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </div>

      {/* Footer + Chat only on Home */}
      {!isLoginPage && (
        <>
          <Footer />
          <ChatAgent />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
