import React from "react";
import NavbarComponent from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ChatAgent from "./components/ChatAgent";

function App() {
  return (
    <div className="relative min-h-screen bg-[#031217] text-white inter-300">
      {/* Navbar */}
      <NavbarComponent />

      {/* Page Content */}
      <Home />

      {/* Floating Chat Bubble */}
      <ChatAgent />

      {/* Footer */}
      <Footer />

      
    </div>
  );
}

export default App;
