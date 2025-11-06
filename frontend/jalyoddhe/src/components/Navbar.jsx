import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
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
          <Nav className="ms-auto flex items-center space-x-4">
            <Nav.Link
              href="#map"
              className="!text-white font-medium transition-all duration-200 hover:!text-[#caf0f8] hover:-translate-y-[1px]"
            >
              Map
            </Nav.Link>
            <Nav.Link
              href="#filters"
              className="!text-white font-medium transition-all duration-200 hover:!text-[#caf0f8] hover:-translate-y-[1px]"
            >
              Filters
            </Nav.Link>
            <Nav.Link
              href="#debris"
              className="!text-white font-medium transition-all duration-200 hover:!text-[#caf0f8] hover:-translate-y-[1px]"
            >
              Debris List
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
