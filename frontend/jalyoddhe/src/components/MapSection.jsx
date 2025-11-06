import React from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const MapSection = () => {
  return (
    <section className="relative mt-10 z-20 w-full flex justify-center">
      <div className="w-[93%] h-[550px] rounded-4xl flex items-center justify-center">
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} className="rounded-4xl mt-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              This is a popup
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
};

export default MapSection;
