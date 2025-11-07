import React, { useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import pin from "../assets/pin.png";

const debrisData = [
  {
    coordinates: [
      { lat: "9.75°N", lon: "76.35°E" },
      { lat: "9.75°N", lon: "76.45°E" },
      { lat: "9.65°N", lon: "76.35°E" },
      { lat: "9.65°N", lon: "76.45°E" },
    ],
    level: "High",
    confidence: "92%",
    description:
      "Heavy accumulation of marine debris detected in this tile region. Requires immediate attention for cleanup operations.",
  },
  {
    coordinates: [
      { lat: "15.45°N", lon: "73.75°E" },
      { lat: "15.45°N", lon: "73.85°E" },
      { lat: "15.35°N", lon: "73.75°E" },
      { lat: "15.35°N", lon: "73.85°E" },
    ],
    level: "Medium",
    confidence: "75%",
    description:
      "Moderate debris detected in this tile. Periodic cleanup recommended to prevent further accumulation.",
  },
  {
    coordinates: [
      { lat: "19.85°N", lon: "85.40°E" },
      { lat: "19.85°N", lon: "85.50°E" },
      { lat: "19.75°N", lon: "85.40°E" },
      { lat: "19.75°N", lon: "85.50°E" },
    ],
    level: "Low",
    confidence: "60%",
    description:
      "Minor traces of debris observed in this region. Monitoring advised but not critical.",
  },
  {
    coordinates: [
      { lat: "19.85°N", lon: "85.40°E" },
      { lat: "19.85°N", lon: "85.50°E" },
      { lat: "19.75°N", lon: "85.40°E" },
      { lat: "19.75°N", lon: "85.50°E" },
    ],
    level: "Low",
    confidence: "60%",
    description:
      "Minor traces of debris observed in this region. Monitoring advised but not critical.",
  },
  {
    coordinates: [
      { lat: "19.85°N", lon: "85.40°E" },
      { lat: "19.85°N", lon: "85.50°E" },
      { lat: "19.75°N", lon: "85.40°E" },
      { lat: "19.75°N", lon: "85.50°E" },
    ],
    level: "Low",
    confidence: "60%",
    description:
      "Minor traces of debris observed in this region. Monitoring advised but not critical.",
  },
];

// Helper function to calculate the midpoint of the 4 coordinates
const calculateMidpoint = (coords) => {
  // Extract numeric lat/lon values (ignoring N/E)
  const lats = coords.map((c) => parseFloat(c.lat));
  const lons = coords.map((c) => parseFloat(c.lon));

  // Calculate averages
  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLon = lons.reduce((a, b) => a + b, 0) / lons.length;

  // Format with 2 decimal places + direction suffix
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
      className="mt-15 px-5 py-4 border-white/40 border rounded-4xl bg-white/10 backdrop-blur-lg "
    >
      <Row className="border-white/40">
        <h3 className="text-lg mb-4 fw-bold text-[#0077b6] ">
          Detected Tiles
        </h3>

        {/* Left Side – Card List */}
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
                  {/* Icon with background */}
                  <div className="flex items-center mb-2">
                    <div className="bg-[#0077b6] rounded-full p-2 mr-3 flex items-center justify-center shadow-md">
                      <img
                        src={pin}
                        alt="pin"
                        className="h-4 w-4 object-contain filter brightness-0 invert"
                      />
                    </div>
                    <div
                      className={`text-sm font-bold ${isSelected ? "text-gray-800" : "text-white"
                        }`}
                    >
                      Tile coordinates: {midpoint.lat}, {midpoint.lon}
                    </div>
                  </div>

                  <div className="mt-3">
                    <Card.Text className="mb-1">
                      <strong>Label:</strong> {debris.level}
                    </Card.Text>
                    <Card.Text className="mb-0">
                      <strong>Confidence:</strong> {debris.confidence}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </Col>

        {/* Right Side – Details */}
        <Col md={7} className="ps-4">
          <Card className="!shadow-3xl !border-0 !rounded-3xl">
            <Card.Body>
              <div className="flex items-center mb-3">
                <div className="bg-[#0077b6] rounded-full p-2 mr-3 flex items-center justify-center shadow-md">
                  <img
                    src={pin}
                    alt="pin"
                    className="h-4 w-4 object-contain filter brightness-0 invert"
                  />
                </div>
                <h4 className="text-[#0077b6] fw-semibold mb-0">
                  {" "}
                  {(() => {
                    const { lat, lon } = calculateMidpoint(
                      debrisData[selectedIndex].coordinates
                    );
                    return `${lat}, ${lon}`;
                  })()}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3 text-gray-800">
                {debrisData[selectedIndex].coordinates.map((coord, i) => (
                  <div key={i}>
                    <strong>Lat:</strong> {coord.lat} |{" "}
                    <strong>Lon:</strong> {coord.lon}
                  </div>
                ))}
              </div>

              <p className="mt-2 mb-1">
                <strong>Level:</strong> {debrisData[selectedIndex].level}
              </p>
              <p className="mb-1">
                <strong>Confidence:</strong>{" "}
                {debrisData[selectedIndex].confidence}
              </p>
              <p className="mt-3 text-gray-700">
                {debrisData[selectedIndex].description}
              </p>
            </Card.Body>
          </Card>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
              <button className="flex items-center gap-1 px-3 py-2 !rounded-xl bg-white/10 hover:bg-white/50 border border-white/20 text-white transition-all duration-200">
                Send Alert
              </button>
              <button className="flex items-center gap-1 px-3 py-2 !rounded-xl bg-white/10 hover:bg-white/50 border border-white/20 text-white transition-all duration-200">
                Mark as Cleaned
              </button>
              <button className="flex items-center gap-1 px-3 py-2 !rounded-xl bg-white/10 hover:bg-white/50 border border-white/20 text-white transition-all duration-200">
                View on Map
              </button>
              <button className="flex items-center gap-1 px-3 py-2 !rounded-xl bg-white/10 hover:bg-white/50 border border-white/20 text-white transition-all duration-200">
                Generate Report
              </button>
            </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DebrisCards;
