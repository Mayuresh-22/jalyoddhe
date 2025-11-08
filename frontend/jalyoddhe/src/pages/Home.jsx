import React from "react";
import HeroSection from "../components/HeroSection";
import MapSection from "../components/MapSection";
import DebrisCards from "../components/DebrisCards";
import Footer from "../components/Footer";
import ChatAgent from "../components/ChatAgent";

const Home = () => {
  return (
    <div className="bg-[#031217] text-white inter-300">
      <HeroSection />

      <div className="px-10">
        {/* Add IDs here */}
        <section id="map">
          <MapSection />
        </section>

        <section id="debris">
          <DebrisCards />
        </section>
      </div>
    </div>
  );
};

export default Home;
