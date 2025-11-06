import React from "react";
import heroImage from "../assets/hero.png";

const HeroSection = () => {
  return (
    <section
      className="relative h-screen w-full bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
        {/* Content */}
        <div className="relative text-center text-white z-10 max-w-2xl px-6">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            From Space to Shore – Detect, Protect, Restore.
          </h1>
          <p className="text-lg sm:text-xl font-light mb-8 text-[#caf0f8]">
            If satellites can see the stars light-years away… shouldn’t we use them to clean our waters right here at home?
          </p>
          <button className="bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white py-3 px-8 text-base rounded-5 font-medium transition-all duration-300 hover:from-[#00b4d8] hover:to-[#0077b6] hover:scale-105">
            Explore Insights
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
