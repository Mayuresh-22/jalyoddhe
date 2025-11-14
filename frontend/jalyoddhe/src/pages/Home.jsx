import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import MapSection from "../components/MapSection";
import DebrisCards from "../components/DebrisCards";
import Footer from "../components/Footer";
import ChatAgent from "../components/ChatAgent";
import { getAOIs, getTiles } from "../utils/api";

const Home = () => {
  const [aois, setAois] = useState([]);
  const [selectedAOI, setSelectedAOI] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTileForZoom, setSelectedTileForZoom] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    const fetchAOIs = async () => {
      try {
        setLoading(true);
        const response = await getAOIs();
        if (response.status === "ok" && response.aois && response.aois.length > 0) {
          setAois(response.aois);
          const defaultAOI = response.aois.find(aoi => aoi.aoi_name.toLowerCase() === "vembanad") || response.aois[0];
          setSelectedAOI(defaultAOI);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching AOIs:", err);
        setError("Failed to load AOIs");
        setLoading(false);
      }
    };

    fetchAOIs();
  }, []);

  useEffect(() => {
    const fetchTiles = async () => {
      if (!selectedAOI) return;

      try {
        setLoading(true);
        const response = await getTiles(selectedAOI.aoi_id);
        if (response.status === "ok") {
          setTiles(response.tiles || []);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tiles:", err);
        setError("Failed to load tiles");
        setLoading(false);
      }
    };

    fetchTiles();
  }, [selectedAOI]);

  const handleAOIChange = (aoi) => {
    setSelectedAOI(aoi);
  };

  const handleViewOnMap = (tile) => {
    setSelectedTileForZoom(tile);
    const mapSection = document.getElementById("map");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  const filteredTiles = selectedFilters.length === 0 
    ? tiles 
    : tiles.filter(tile => {
        const tileLabels = tile.prediction?.labels || [];
        return tileLabels.some(label => selectedFilters.includes(label));
      });

  return (
    <div className="bg-[#031217] text-white inter-300 min-h-screen">

      <HeroSection />

      <div className="flex flex-col mt-10 max-w-7xl mx-auto space-y-10 px-4 sm:px-6 lg:px-10">
        <section id="map">
          <MapSection 
            aois={aois}
            selectedAOI={selectedAOI}
            tiles={filteredTiles}
            onAOIChange={handleAOIChange}
            loading={loading}
            selectedTileForZoom={selectedTileForZoom}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </section>

        <section id="debris">
          <DebrisCards 
            tiles={filteredTiles}
            loading={loading}
            error={error}
            onViewOnMap={handleViewOnMap}
          />
        </section>
      </div>
      
    </div>
  );
};

export default Home;
