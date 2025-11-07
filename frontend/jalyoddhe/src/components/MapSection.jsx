import React from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import FiltersOverlay from "../components/FiltersOverlay"; 

const MapSection = () => {
  return (
    <section className="relative mt-10 z-20 w-full flex justify-center">
      <div className="w-[95%] h-[550px] rounded-4xl flex items-center justify-center">
        <MapContainer center={[9.5968, 76.3985]} zoom={13} scrollWheelZoom={true} className="rounded-4xl mt-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[9.5968, 76.3985]}>
            <Popup>
              Vembanand Lake
            </Popup>
          </Marker>
        </MapContainer>

        <FiltersOverlay />
      </div>
    </section>
  );
};

export default MapSection;
