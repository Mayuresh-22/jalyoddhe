import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Polygon, useMap, Circle } from "react-leaflet";
import FiltersOverlay from "../components/FiltersOverlay";

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

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapSection = ({ aois = [], selectedAOI, tiles = [], onAOIChange, loading, selectedTileForZoom, selectedFilters = [], onFilterChange }) => {
  const [mapCenter, setMapCenter] = useState([9.5968, 76.3985]);
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    if (tiles.length > 0 && tiles[0].bounds) {
      const firstBounds = tiles[0].bounds;
      const centerLat = (firstBounds[1] + firstBounds[3]) / 2;
      const centerLon = (firstBounds[0] + firstBounds[2]) / 2;
      setMapCenter([centerLat, centerLon]);
      setMapZoom(13);
    }
  }, [tiles]);

  useEffect(() => {
    if (selectedTileForZoom && selectedTileForZoom.bounds) {
      const bounds = selectedTileForZoom.bounds;
      const centerLat = (bounds[1] + bounds[3]) / 2;
      const centerLon = (bounds[0] + bounds[2]) / 2;
      setMapCenter([centerLat, centerLon]);
      setMapZoom(16);
    }
  }, [selectedTileForZoom]);

  const getTilePolygonCoords = (bounds) => {
    const [left, bottom, right, top] = bounds;
    return [
      [bottom, left],
      [top, left],
      [top, right],
      [bottom, right],
    ];
  };

  const getTileMidpoint = (bounds) => {
    const [left, bottom, right, top] = bounds;
    return [(bottom + top) / 2, (left + right) / 2];
  };

  const getRadiusFromBounds = (bounds) => {
    const [left, bottom, right, top] = bounds;
    const latDiff = top - bottom;
    const lonDiff = right - left;
    // Approximate radius as half the diagonal distance of the bounding box
    return Math.sqrt((latDiff * latDiff) + (lonDiff * lonDiff)) * 111320 / 2; // Convert degrees to meters
  };

  return (
    <section className="relative z-20 w-full flex justify-center">
      <div className="w-full h-[550px] rounded-4xl flex items-center justify-center overflow-hidden relative">

        <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} className="w-full h-full rounded-4xl z-0">
          <MapUpdater center={mapCenter} zoom={mapZoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {tiles.map((tile, index) => {
            if (!tile.bounds || !tile.prediction) return null;
            
            const primaryLabel = tile.prediction.labels?.[0] || "Marine Debris";
            const color = labelColors[primaryLabel] || "#808080";
            const polygonCoords = getTilePolygonCoords(tile.bounds);
            const midpoint = getTileMidpoint(tile.bounds);
            const radius = getRadiusFromBounds(tile.bounds);

            return (
              <React.Fragment key={tile.tile_id || index}>
                <Circle
                  center={midpoint}
                  radius={radius}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.3,
                    weight: 1,
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>Labels:</strong> {tile.prediction.labels?.join(", ")}<br />
                      <strong>Confidence:</strong> {tile.prediction.confidence?.map(c => `${(c * 100).toFixed(1)}%`).join(", ")}
                    </div>
                  </Popup>
                </Circle>
                <Marker position={midpoint}>
                  <Popup>
                    <div className="text-sm">
                      <strong>Tile ID:</strong> {tile.tile_id}<br />
                      <strong>Labels:</strong> {tile.prediction.labels?.join(", ")}
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

        </MapContainer>

        <FiltersOverlay 
          aois={aois}
          selectedAOI={selectedAOI}
          onAOIChange={onAOIChange}
          selectedFilters={selectedFilters}
          onFilterChange={onFilterChange}
        />

      </div>
    </section>
  );
};

export default MapSection;
