import React from "react";
import HeroSection from "../components/HeroSection";
import MapSection from "../components/MapSection";
import FiltersOverlay from "../components/FiltersOverlay";
import DebrisCards from "../components/DebrisCards";

const Home = () => {
  return (
    <div className="bg-[#031217] text-white inter-300">
      <HeroSection />
      <MapSection />
      <FiltersOverlay />
      <DebrisCards />
    </div>
  );
};

export default Home;
