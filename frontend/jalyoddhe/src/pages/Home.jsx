import React from "react";
import HeroSection from "../components/HeroSection";
import MapSection from "../components/MapSection";
import DebrisCards from "../components/DebrisCards";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="bg-[#031217] text-white inter-300">
      <HeroSection />
      <div className="px-10">
        <MapSection />
        <DebrisCards />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
