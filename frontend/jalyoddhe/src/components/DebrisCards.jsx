import React, { useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import pin from "../assets/pin.png";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

// Available filter labels and their colors (reuse from FiltersOverlay)
const labelColors = {
  "Marine Debris": "#D32F2F",
  "Dense Sargassum": "#1B5E20",
  "Sparse Sargassum": "#43A047",
  "Natural Organic Material": "#8D6E63",
  "Sediment-Laden Water": "#EF6C00",
  "Foam": "#E0C097",
};

// Example debris data (with multiple labels per tile)
const debrisData = [
  {
    coordinates: [
      { lat: "9.75°N", lon: "76.35°E" },
      { lat: "9.75°N", lon: "76.45°E" },
      { lat: "9.65°N", lon: "76.35°E" },
      { lat: "9.65°N", lon: "76.45°E" },
    ],
    labels: ["Marine Debris", "Foam", "Dense Sargassum"],
    confidence: "92%",
    lastupdated: "2024-06-15",
  },
  {
    coordinates: [
      { lat: "15.45°N", lon: "73.75°E" },
      { lat: "15.45°N", lon: "73.85°E" },
      { lat: "15.35°N", lon: "73.75°E" },
      { lat: "15.35°N", lon: "73.85°E" },
    ],
    labels: ["Sparse Sargassum", "Sediment-Laden Water"],
    confidence: "75%",
    lastupdated: "2024-06-15",
  },
  {
    coordinates: [
      { lat: "19.85°N", lon: "85.40°E" },
      { lat: "19.85°N", lon: "85.50°E" },
      { lat: "19.75°N", lon: "85.40°E" },
      { lat: "19.75°N", lon: "85.50°E" },
    ],
    labels: ["Natural Organic Material"],
    confidence: "60%",
    lastupdated: "2024-06-15",
  },
];

// Helper to compute midpoint
const calculateMidpoint = (coords) => {
  const lats = coords.map((c) => parseFloat(c.lat));
  const lons = coords.map((c) => parseFloat(c.lon));
  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLon = lons.reduce((a, b) => a + b, 0) / lons.length;

  return {
    lat: `${avgLat.toFixed(2)}°N`,
    lon: `${avgLon.toFixed(2)}°E`,
  };
};

const DebrisCards = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Container
      fluid
      className="mt-15 px-5 py-4 rounded-4xl bg-white/10 backdrop-blur-lg "
    >
      <Row className="border-white/10">
        <h3 className="text-lg mb-4 fw-bold text-[#0077b6] ">
          Detected Tiles
        </h3>

        {/* LEFT SIDE - Tile Cards */}
        <Col
          md={5}
          className="overflow-y-auto h-[80vh] pe-4 border-end border-gray-300"
        >
          {debrisData.map((debris, index) => {
            const isSelected = selectedIndex === index;
            const midpoint = calculateMidpoint(debris.coordinates);

            return (
              <Card
                key={index}
                className={`mb-3 cursor-pointer !rounded-3xl !transition-all !relative !border-white/40 !border !bg-white/10 !backdrop-blur-lg
                  ${isSelected
                    ? "!shadow-xl !border-[#0077b6] !bg-white/100 backdrop-blur-xl"
                    : "!shadow-md !border-gray-200 !bg-white/20"
                  }`}
                onClick={() => setSelectedIndex(index)}
              >
                <Card.Body
                  className={`transition-all duration-300 ${isSelected ? "text-gray-800" : "text-white"
                    }`}
                >
                  {/* Icon + Title */}
                  <div className="flex items-center mb-2">
                    <div className="bg-[#0077b6] rounded-full p-2 mr-3 flex items-center justify-center shadow-md">
                      <img
                        src={pin}
                        alt="pin"
                        className="h-4 w-4 object-contain filter brightness-0 invert"
                      />
                    </div>
                    <div
                      className={`text-m font-bold ${isSelected ? "text-gray-800" : "text-white"
                        }`}
                    >
                      Tile coordinates: {midpoint.lat}, {midpoint.lon}
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {debris.labels.map((label) => (
                      <span
                        key={label}
                        className="text-xs px-2.5 py-1 rounded-full font-medium shadow-sm"
                        style={{
                          backgroundColor: labelColors[label],
                          color: "#fff",
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Confidence */}
                  <Card.Text className="mt-2 mb-0 text-sm font-medium">
                    <strong>Confidence:</strong> {debris.confidence}
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </Col>

        {/* RIGHT SIDE - Detailed Info */}
        <Col md={7} className="ps-4">
          <Card className="!rounded-[2rem] !bg-white/10 !text-white !backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:shadow-[0_6px_40px_rgba(0,0,0,0.15)]">
            <Card.Body className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#0077b6] rounded-full p-3 flex items-center justify-center shadow-lg">
                  <img
                    src={pin}
                    alt="pin"
                    className="h-5 w-5 object-contain filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h4 className="text-[#0077b6] text-xl text-white md:text-2xl font-semibold tracking-tight mb-0">
                    {(() => {
                      const { lat, lon } = calculateMidpoint(
                        debrisData[selectedIndex].coordinates
                      );
                      return `${lat}, ${lon}`;
                    })()}
                  </h4>
                </div>
              </div>

              {/* Subsection: Area of Tile */}
              <div className="mb-6">
                <p className="text-[#ffffff] font-medium text-m tracking-wide mb-2">
                  Area of Tile
                </p>
                <div className="grid grid-cols-2 gap-2 !bg-white/40 rounded-3xl px-4 py-4 shadow-xl text-[0.9rem] text-black">
                  {debrisData[selectedIndex].coordinates.map((coord, i) => (
                    <div key={i} className="flex justify-space-evenly gap-3">
                      <span className="font-medium">Lat: {coord.lat} </span>
                      <span className="font-medium">Lon: {coord.lon}</span>
                      <span></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subsection: Labels */}
              <div className="mb-4">
                <p className="text-[#ffffff] font-medium text-m tracking-wide mb-2">
                  Detected Labels
                </p>
                <div className="flex flex-wrap gap-2">
                  {debrisData[selectedIndex].labels.map((label) => (
                    <span
                      key={label}
                      className="text-xs md:text-sm px-3 py-1.5 rounded-full font-medium shadow-sm transition-all duration-200 hover:scale-[1.05]"
                      style={{
                        backgroundColor: labelColors[label],
                        color: "#fff",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Confidence + Description */}
              <div className="border-t border-white/80 ">
                <p className="text-[#ffffff] my-3 text-[0.95rem]">
                  <strong className="fw-semibold">Confidence:</strong>{" "}
                  <span className="text-[#ffffff] font-light">
                    {debrisData[selectedIndex].confidence}
                  </span>
                </p>
                <p className="text-[#ffffff] text-[0.95rem]">
                  <strong className="fw-semibold">Last Updated:</strong>{" "}
                  <span className="text-[#ffffff] font-light">
                    {debrisData[selectedIndex].lastupdated}
                  </span>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Buttons */}
<div className="flex flex-wrap gap-4 mt-6 justify-center">
  <PrimaryButton text="View on Map" wide onClick={() => alert("Opening map...")} />
  <SecondaryButton text="Generate Report" onClick={() => alert("Generating Report...")} />
</div>

        </Col>

      </Row>
    </Container>
  );
};

export default DebrisCards;
