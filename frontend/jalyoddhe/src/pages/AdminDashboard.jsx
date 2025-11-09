import React, { useState } from "react";
import NavbarComponent from "../components/Navbar";

const AdminDashboard = () => {
  const [aoiList, setAoiList] = useState([
    { name: "Vembanad", polygon: "", driveLink: "" },
  ]);
  const [executedColab, setExecutedColab] = useState(false);
  const [executedNB, setExecutedNB] = useState(false);
  const [updatedIds, setUpdatedIds] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAOIChange = (index, field, value) => {
    const updated = [...aoiList];
    updated[index][field] = value;
    setAoiList(updated);
  };

  const addAOI = () =>
    setAoiList([...aoiList, { name: "", polygon: "", driveLink: "" }]);

  const handleUpdate = (e) => {
    e.preventDefault();
    alert("AOIs updated successfully!");
  };

  const handleStartInference = () => {
    if (!executedNB || !updatedIds) {
      alert("Please confirm both steps before starting inference.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Inference pipeline started successfully!");
    }, 2000);
  };

  return (
    <div className="!bg-[#031217] !text-white inter-300 !min-h-screen">
      <NavbarComponent isDashboardPage={true} />

      {/* Main Dashboard Layout */}
      <div className="!px-10 !pt-24 !pb-4 !space-y-12">
        {/* Header */}
        <section className="!mb-10 px-4">
          <h1 className="!text-3xl !font-semibold !text-white/90 !mb-2">
            Welcome to Jalyoddhe’s Dashboard
          </h1>
          <p className="!text-white/70">
            Manage your AI inference pipeline and update GEE data seamlessly.
          </p>
        </section>

        {/* Main Content Wrapper */}
        <section className="!bg-white/10 !backdrop-blur-xl !rounded-4xl !shadow-[0_8px_32px_rgba(0,0,0,0.3)] !p-10 !space-y-10">
          {/* Execute Notebook */}
          <div id="execute">
            <h2 className="!text-2xl !font-medium !mb-4 !text-white/90">
              Execute Google Colab Notebook
            </h2>
            <div className="!flex !items-center !gap-3">
              <input
                type="checkbox"
                checked={executedColab}
                onChange={(e) => setExecutedColab(e.target.checked)}
                className="!w-4 !h-4 accent-white"
              />
              <label className="!text-white/70 !text-sm">
                I have executed the notebook successfully.
              </label>
            </div>
          </div>

          {/* Divider */}
          <hr className="!border-t !border-white/60" />

          {/* Update AOIs */}
          <div id="update">
            <h2 className="!text-2xl !font-medium !text-white/90 !mb-4">
              Update AOIs
            </h2>

            <form onSubmit={handleUpdate} className="!space-y-5">
              {/* Scrollable AOI list */}
              <div className="!space-y-4 !max-h-[250px] !overflow-y-auto !px-2 custom-scrollbar">
                {aoiList.map((aoi, index) => (
                  <div key={index}>
                    <div className="!flex !flex-col md:!flex-row !gap-3">
                      <input
                        type="text"
                        placeholder="AOI Name"
                        value={aoi.name}
                        onChange={(e) =>
                          handleAOIChange(index, "name", e.target.value)
                        }
                        className="!flex-1 !bg-white/10 !rounded-3xl !py-3 !px-6 !border !border-white/10 !shadow-[0_2px_15px_rgba(255,255,255,0.05)] !transition-all !hover:bg-white/20"
                      />
                      <input
                        type="text"
                        placeholder="Polygon Coordinates"
                        value={aoi.polygon}
                        onChange={(e) =>
                          handleAOIChange(index, "polygon", e.target.value)
                        }
                        className="!flex-1 !bg-white/10 !rounded-3xl !py-3 !px-6 !border !border-white/10 !shadow-[0_2px_15px_rgba(255,255,255,0.05)] !transition-all hover:!bg-white/20"
                      />
                      <input
                        type="text"
                        placeholder="Google Drive Link"
                        value={aoi.driveLink}
                        onChange={(e) =>
                          handleAOIChange(index, "driveLink", e.target.value)
                        }
                        className="!flex-1 !bg-white/10 !rounded-3xl !py-3 !px-6 !border !border-white/10 !shadow-[0_2px_15px_rgba(255,255,255,0.05)] !transition-all hover:!bg-white/20"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="!flex !justify-between !items-center">
                <button
                  type="button"
                  onClick={addAOI}
                  className="!text-white/80 hover:!text-white !transition-all !duration-300"
                >
                  + Add AOI
                </button>

                {/* Update Button - Matches “View on Map” */}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 !rounded-3xl bg-[#0077b6] hover:bg-[#005c8a] text-white text-sm font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.03]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>

          {/* Divider */}
          <hr className="!border-t !border-white/60" />

          {/* Start Inference */}
          <div id="inference">
            <h2 className="!text-2xl !font-medium !mb-4 !text-white/90">
              Start Inference Pipeline
            </h2>

            <div className="!space-y-3 !mb-6">
              <div className="!flex !items-center !gap-3">
                <input
                  type="checkbox"
                  checked={executedNB}
                  onChange={(e) => setExecutedNB(e.target.checked)}
                  className="!w-4 !h-4 accent-white"
                />
                <label className="!text-white/70 !text-sm">
                  I have executed the notebook.
                </label>
              </div>

              <div className="!flex !items-center !gap-3">
                <input
                  type="checkbox"
                  checked={updatedIds}
                  onChange={(e) => setUpdatedIds(e.target.checked)}
                  className="!w-4 !h-4 accent-white"
                />
                <label className="!text-white/70 !text-sm">
                  I have updated the file IDs.
                </label>
              </div>
            </div>

            {/* Start Inference Button - Matches “View on Map” */}
            <button
              onClick={handleStartInference}
              disabled={isProcessing}
              className={`flex w-full items-center justify-center gap-2 px-5 py-2.5 !rounded-3xl text-white text-sm font-medium shadow-md transition-all duration-300 ${
                isProcessing
                  ? "!bg-gray-600 !cursor-not-allowed"
                  : "bg-[#0077b6] hover:bg-[#005c8a] hover:shadow-lg hover:scale-[1.01]"
              }`}
            >
              {isProcessing ? "Processing..." : "Start Inference Pipeline"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;

