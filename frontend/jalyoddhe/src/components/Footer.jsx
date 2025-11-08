import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full h-[8vh] bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center mt-2">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-8 text-center md:text-left gap-4">
        
        {/* Left Side - Project Name */}
        <p className="text-white/80 text-sm tracking-wide flex items-center justify-center my-2">
          © {new Date().getFullYear()}{" "}
          <span className="text-[#00b4d8] font-semibold mx-1">Jalyoddhe</span>
          | Marine Debris Detection Platform
        </p>

        {/* Right Side - About + GitHub */}
        <div className="flex items-center gap-5">
          {/* About link */}
          <a
            href="#about"
            className="!text-white/100 !text-sm !hover:text-[#00b4d8] !transition-all !duration-200 !no-underline"
          >
            About
          </a>

          {/* GitHub Icon */}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="!flex !items-center !justify-center !w-8 !h-8 !rounded-full !bg-white/10 !hover:bg-[#00b4d8]/20 !border !border-white/20 !text-white/80 !hover:text-[#00b4d8] !transition-all !duration-300 !shadow-sm !hover:shadow-md"
            title="View on GitHub"
          >
            <FaGithub className="text-2xl text-white/100" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
