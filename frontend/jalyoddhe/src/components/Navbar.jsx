import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const NavbarComponent = ({ isLoginPage }) => {
  const navigate = useNavigate();

  // Smooth scroll with offset for sections
  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -80;
      const yPosition =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="bg-white/10 backdrop-blur-md shadow-md transition-all duration-300 hover:bg-white/25"
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="flex items-center text-white font-semibold text-lg cursor-pointer"
        >
          {logo && <img src={logo} alt="logo" className="h-9 w-9 object-contain mr-2" />}
          Jalyoddhe
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="bg-white/30 border-none focus:ring-2 focus:ring-white/40"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto flex items-center space-x-5">
            {isLoginPage ? (
              // 🧭 Minimal Navbar (Login Page)
              <button
                onClick={() => navigate("/")}
                className="w-full !bg-[#0077b6] !hover:bg-[#00b4d8] !text-white !font-semibold !py-1 !px-4 !rounded-3xl !shadow-md !transition-all !duration-200 !ease-in-out"
              >
                Home
              </button>
            ) : (
              // 🧭 Full Navbar (Home Page)
              <>
                <Nav.Link
                  onClick={() => handleScroll("map")}
                  className="!text-white font-medium hover:!text-[#caf0f8] cursor-pointer no-underline"
                >
                  Map
                </Nav.Link>
                <Nav.Link
                  onClick={() => handleScroll("debris")}
                  className="!text-white font-medium hover:!text-[#caf0f8] cursor-pointer no-underline whitespace-nowrap"
                >
                  Debris List
                </Nav.Link>
                <button
                  onClick={() => navigate("/admin/login")}
                  className="!w-full !bg-[#0077b6] !hover:bg-[#00b4d8] !text-white !font-semibold !py-1 !px-4 !rounded-3xl !shadow-md !transition-all !duration-200 !ease-in-out"
                >
                  Login
                </button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
