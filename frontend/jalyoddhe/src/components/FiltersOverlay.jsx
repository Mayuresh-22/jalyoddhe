import React, { useState } from "react";
import { Form } from "react-bootstrap";

const FiltersOverlay = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const filters = [
    { name: "Marine Debris", color: "#D32F2F" },
    { name: "Dense Sargassum", color: "#1B5E20" },
    { name: "Sparse Sargassum", color: "#43A047" },
    { name: "Natural Organic Material", color: "#8D6E63" },
    { name: "Sediment-Laden Water", color: "#EF6C00" },
    { name: "Foam", color: "#E0C097" },
  ];

  const toggleFilter = (name) => {
    setSelectedFilters((prev) =>
      prev.includes(name)
        ? prev.filter((f) => f !== name)
        : [...prev, name]
    );
  };

  const clearFilters = () => setSelectedFilters([]);

  return (
    <>
      {/* Main Overlay */}
      <div className="absolute -top-8 right-10 z-[1000] bg-white/40 backdrop-blur-xl border border-white/40 rounded-4xl shadow-lg px-4 py-3 w-[360px]">
        <Form>
          <div className="flex items-center justify-between gap-3">
            {/* Select Place */}
            <Form.Group className="flex-1">
              <Form.Select className="bg-white/70 text-black border-none focus:ring-2 focus:ring-[#00b4d8]">
                <option>Vembanad</option>
                <option>Goa</option>
                <option>Chilika</option>
              </Form.Select>
            </Form.Group>

            {/* Filters Button */}
            <div className="flex-1 relative">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full bg-[#0077b6] hover:bg-[#00b4d8] text-white  font-semibold py-2 px-4 rounded-2xl shadow-md transition-all duration-200 ease-in-out"
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

      {/* Dropdown rendered outside for real glass effect */}
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
