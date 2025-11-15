import { useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import pin from "../assets/pin.png";
import PrimaryButton from "../components/PrimaryButton";

const labelColors = {
  "Marine Debris": "#D32F2F",
  "Dense Sargassum": "#1B5E20",
  "Sparse Sargassum": "#43A047",
  "Natural Organic Material": "#8D6E63",
  "Sediment-Laden Water": "#EF6C00",
  "Foam": "#E0C097",
  "Ship": "#757575",
  "Clouds": "#E0E0E0",
  "Marine Water": "#01579B",
  "Turbid Water": "#8D6E63",
  "Shallow Water": "#4FC3F7",
};

const getBoundsCorners = (bounds) => {
  const [left, bottom, right, top] = bounds;
  return [
    { lat: `${top.toFixed(2)}°N`, lon: `${left.toFixed(2)}°E` },
    { lat: `${top.toFixed(2)}°N`, lon: `${right.toFixed(2)}°E` },
    { lat: `${bottom.toFixed(2)}°N`, lon: `${left.toFixed(2)}°E` },
    { lat: `${bottom.toFixed(2)}°N`, lon: `${right.toFixed(2)}°E` },
  ];
};

const calculateMidpoint = (bounds) => {
  const [left, bottom, right, top] = bounds;
  const avgLat = (bottom + top) / 2;
  const avgLon = (left + right) / 2;

  return {
    lat: `${avgLat.toFixed(2)}°N`,
    lon: `${avgLon.toFixed(2)}°E`,
  };
};

const DebrisCards = ({ tiles = [], loading, error, onViewOnMap }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (loading) {
    return (
      <Container fluid className="w-full px-5 py-6 rounded-4xl bg-white/10 backdrop-blur-lg">
        <div className="text-center text-white py-10">
          <p>Loading tiles...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="w-full px-5 py-6 rounded-4xl bg-white/10 backdrop-blur-lg">
        <div className="text-center text-red-400 py-10">
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  if (tiles.length === 0) {
    return (
      <Container fluid className="w-full px-5 py-6 rounded-4xl bg-white/10 backdrop-blur-lg">
        <div className="text-center text-white py-10">
          <p>No tiles found for this area.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="w-full px-5 py-6 rounded-4xl bg-white/10 backdrop-blur-lg"
    >
      <Row className="border-white/10">
        <h3 className="text-lg mb-4 fw-bold text-[#0077b6] ">
          Detected Tiles
        </h3>

        {/* Tile Cards */}
        <Col
          md={5}
          className="overflow-y-auto max-h-[56vh] sm:max-h-[68vh] pe-4"
        >
          {tiles.map((tile, index) => {
            const isSelected = selectedIndex === index;
            const midpoint = calculateMidpoint(tile.bounds);
            const labels = tile.prediction?.labels || [];
            const confidences = tile.prediction?.confidence || [];

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
                  className={`transition-all duration-300 ${isSelected ? "text-gray-800" : "text-white"} overflow-hidden`}
                >

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

                  <div className="mt-3 flex flex-wrap gap-2">
                    {labels.map((label, idx) => (
                      <span
                        key={`${label}-${idx}`}
                        className="text-xs px-2.5 py-1 rounded-full font-medium shadow-sm"
                        style={{
                          backgroundColor: labelColors[label] || "#808080",
                          color: "#fff",
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  <Card.Text className="mt-2 mb-0 text-sm font-medium">
                    <strong>Confidence:</strong> {confidences.length > 0 ? confidences.map((c, idx) => `${labels[idx]}: ${(c * 100).toFixed(1)}%`).join(", ") : "N/A"}
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </Col>

        {/* Detailed Tile Info Card */}
        <Col md={7} className="ps-4">
          <Card className="!rounded-[2rem] !bg-white/10 !text-white !backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:shadow-[0_6px_40px_rgba(0,0,0,0.15)]">
            <Card.Body className="p-6 md:p-8">

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
                        tiles[selectedIndex].bounds
                      );
                      return `${lat}, ${lon}`;
                    })()}
                  </h4>
                </div>

              </div>

                <div className="mb-6">

                <p className="text-[#ffffff] font-medium text-m tracking-wide mb-2">
                  Area of Tile
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/40 rounded-3xl px-4 py-4 shadow-xl text-[0.9rem] text-black">
                  {getBoundsCorners(tiles[selectedIndex].bounds).map((coord, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start sm:items-center">
                      <span className="font-medium">Lat: {coord.lat}</span>
                      <span className="font-medium">Lon: {coord.lon}</span>
                    </div>
                  ))}
                </div>

              </div>

              <div className="mb-4">

                <p className="text-[#ffffff] font-medium text-m tracking-wide mb-2">
                  Detected Labels
                </p>

                <div className="flex flex-wrap gap-2">
                  {tiles[selectedIndex].prediction?.labels?.map((label, idx) => (
                    <span
                      key={`${label}-${idx}`}
                      className="text-xs md:text-sm px-3 py-1.5 rounded-full font-medium shadow-sm transition-all duration-200 hover:scale-[1.05]"
                      style={{
                        backgroundColor: labelColors[label] || "#808080",
                        color: "#fff",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/80 ">

                <p className="text-[#ffffff] my-3 text-[0.95rem]">
                  <strong className="fw-semibold">Confidence:</strong>{" "}
                  <span className="text-[#ffffff] font-light">
                    {tiles[selectedIndex].prediction?.confidence?.length > 0
                      ? tiles[selectedIndex].prediction.confidence.map((c, idx) => 
                          `${tiles[selectedIndex].prediction.labels[idx]}: ${(c * 100).toFixed(1)}%`
                        ).join(", ")
                      : "N/A"}
                  </span>
                </p>

                <p className="text-[#ffffff] text-[0.95rem]">
                  <strong className="fw-semibold">Last Updated:</strong>{" "}
                  <span className="text-[#ffffff] font-light">
                    {tiles[selectedIndex].last_updated ? new Date(tiles[selectedIndex].last_updated).toLocaleDateString() : "N/A"}
                  </span>
                </p>

              </div>
            </Card.Body>
          </Card>

          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            <PrimaryButton 
              text="View on Map" 
              wide 
              onClick={() => onViewOnMap && onViewOnMap(tiles[selectedIndex])} 
            />
          </div>

        </Col>

      </Row>
    </Container>
  );
};

export default DebrisCards;
