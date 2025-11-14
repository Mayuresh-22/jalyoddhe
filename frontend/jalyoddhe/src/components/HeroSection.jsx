import React from "react";
import heroImage from "../assets/hero.png";

const HeroSection = () => {
  const scrollToDebris = () => {
    const debrisSection = document.getElementById("map");
    if (debrisSection) {
      const yOffset = -80; // offset for navbar
      const yPosition =
        debrisSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative h-screen w-full bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url(${heroImage})` }}
    >

      <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
        <div className="relative text-center text-white z-10 max-w-2xl px-6">

          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            From Space to Shore – Detect, Protect, Restore.
          </h1>

          <p className="text-lg sm:text-xl font-light mb-8 text-[#caf0f8]">
            If satellites can see the stars light-years away… shouldn’t we use them
            to clean our waters right here at home?
          </p>

          <button
            onClick={scrollToDebris}
            className="bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white py-3 px-8 text-base rounded-5 font-medium transition-all duration-300 hover:from-[#00b4d8] hover:to-[#0077b6] hover:scale-105"
          >
            Explore Insights
          </button>

        </div>
      </div>

      <button
        onClick={scrollToDebris}
        aria-label="Scroll to content"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 bg-transparent border-0 p-0 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-7 h-7 text-white/90 animate-bounce"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>

        <span className="text-sm text-white/80">Scroll</span>
      </button>

    </section>
  );
};

export default HeroSection;
