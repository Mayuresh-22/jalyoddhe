import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import logo from "../assets/logo.png";

const NavbarComponent = () => {
  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="bg-white/10 backdrop-blur-md shadow-md transition-all duration-300 hover:bg-white/25"
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand
          href="#"
          className="flex items-center text-white font-semibold text-lg"
        >
          {logo && (
            <img
              src={logo}
              alt="logo"
              className="h-9 w-9 object-contain mr-2"
            />
          )}
          Jalyoddhe
        </Navbar.Brand>

        {/* Toggle */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="bg-white/30 border-none focus:ring-2 focus:ring-white/40"
        />

        {/* Collapse Menu */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto flex items-center space-x-5">
            <Nav.Link
              href="#map"
              className="!text-white font-medium transition-all duration-200 hover:!text-[#caf0f8] hover:-translate-y-[1px] no-underline"
            >
              Map
            </Nav.Link>

            <Nav.Link
              href="#debris"
              className="!text-white font-medium transition-all duration-200 hover:!text-[#caf0f8] hover:-translate-y-[1px] no-underline"
            >
              Debris List
            </Nav.Link>

            {/* Login Button */}
            <button className="flex items-center gap-2 px-4 py-1.5 !rounded-3xl bg-[#0077b6] hover:bg-[#0096c7] text-white text-sm font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.03]">
              Login
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
