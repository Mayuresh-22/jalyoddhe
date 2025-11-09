import React, { useState } from "react";
import { Form } from "react-bootstrap";

const FiltersOverlay = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("Vembanad");

  const filters = [
    { name: "Marine Debris", color: "#D32F2F" },
    { name: "Dense Sargassum", color: "#1B5E20" },
    { name: "Sparse Sargassum", color: "#43A047" },
    { name: "Natural Organic Material", color: "#8D6E63" },
    { name: "Sediment-Laden Water", color: "#EF6C00" },
    { name: "Foam", color: "#E0C097" },
  ];

  const places = ["Vembanad", "Goa", "Chilika"];

  const toggleFilter = (name) => {
    setSelectedFilters((prev) =>
      prev.includes(name)
        ? prev.filter((f) => f !== name)
        : [...prev, name]
    );
  };

  const clearFilters = () => setSelectedFilters([]);

  const selectPlace = (place) => {
    setSelectedPlace(place);
    setShowPlaces(false);
  };

  return (
    <>
      {/* Main Overlay */}
      <div className="absolute -top-8 right-10 z-[1000] bg-white/40 backdrop-blur-xl border border-white/40 rounded-4xl shadow-lg px-4 py-3 w-[360px]">
        <Form>
          <div className="flex items-center justify-between gap-3">
            {/* Place Button */}
            <div className="flex-1 relative">
              <button
                type="button"
                onClick={() => {
                  setShowPlaces(!showPlaces);
                  setShowFilters(false);
                }}
                className="w-full bg-white/70 hover:bg-white/90 text-black font-medium py-2 px-4 rounded-2xl shadow-sm transition-all duration-200 text-sm"
                style={{ borderRadius: "9999px" }}
              >
                {selectedPlace}
              </button>
            </div>

            {/* Filters Button */}
            <div className="flex-1 relative">
              <button
                type="button"
                onClick={() => {
                  setShowFilters(!showFilters);
                  setShowPlaces(false);
                }}
                className="w-full bg-[#0077b6] hover:bg-[#005c8a] text-white font-semibold py-2 px-4 rounded-2xl shadow-md transition-all duration-200 ease-in-out"
                style={{ borderRadius: "9999px" }}
              >
                {selectedFilters.length > 0
                  ? `${selectedFilters.length} Selected`
                  : "Apply Filters"}
              </button>
            </div>
          </div>
        </Form>
      </div>

      {/* --- Floating Places Dropdown --- */}
      {showPlaces && (
        <div className="absolute top-[50px] right-10 w-[270px] bg-white/40 backdrop-blur-xl border border-white/40 rounded-4xl shadow-lg px-4 py-3 z-[2000] transition-all duration-200 ease-in-out">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#0077b6] font-semibold text-sm">
              Select Location
            </span>
            <button
              onClick={() => setShowPlaces(false)}
              className="text-lg text-gray-600 hover:text-black"
            >
              ✕
            </button>
          </div>

          {/* Places List */}
          <div className="flex flex-col py-1 max-h-[50%] overflow-y-auto">
            {places.map((place) => (
              <div
                key={place}
                className={`px-4 py-2 cursor-pointer text-sm transition-all rounded-md ${
                  selectedPlace === place
                    ? "bg-[#00b4d8]/30 text-[#0077b6] font-medium"
                    : "text-black hover:bg-white/80"
                }`}
                onClick={() => selectPlace(place)}
              >
                {place}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Floating Filters Dropdown --- */}
      {showFilters && (
        <div className="absolute top-[50px] right-10 w-[270px] bg-white/40 backdrop-blur-xl border border-white/40 rounded-4xl shadow-lg px-4 py-3 z-[2000] transition-all duration-200 ease-in-out">
          <div className="flex justify-between items-center mb-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                clearFilters();
              }}
              className="text-sm text-[#0077b6] hover:underline"
            >
              Clear
            </button>

            <button
              onClick={() => setShowFilters(false)}
              className="text-lg text-gray-600 hover:text-black"
            >
              ✕
            </button>
          </div>

          {/* Filter List */}
          <div className="flex flex-col py-1 max-h-[50%] overflow-y-auto">
            {filters.map((filter) => {
              const isChecked = selectedFilters.includes(filter.name);
              return (
                <div
                  key={filter.name}
                  className="flex items-center gap-3 py-3 px-2 cursor-pointer hover:bg-white/70 rounded-md transition-all text-black select-none"
                  onClick={() => toggleFilter(filter.name)}
                >
                  {/* Custom Colored Checkbox */}
                  <div
                    className="w-5.5 h-5.5 flex items-center justify-center rounded-md border-[1px] transition-all shrink-0"
                    style={{
                      borderColor: filter.color,
                      backgroundColor: isChecked
                        ? filter.color
                        : "transparent",
                    }}
                  >
                    {isChecked && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="white"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Label Text */}
                  <span className="text-sm">{filter.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default FiltersOverlay;
