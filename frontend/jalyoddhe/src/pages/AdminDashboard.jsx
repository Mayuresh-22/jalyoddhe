import React, { useState } from "react";
import NavbarComponent from "../components/Navbar";
import PrimaryButton from "../components/PrimaryButton";

const AdminDashboard = () => {
  const [aoiList, setAoiList] = useState([
    { name: "Vembanad", polygon: "", driveLink: "" },
  ]);

  const [executedColab, setExecutedColab] = useState(false);
  const [executedNB, setExecutedNB] = useState(false);
  const [updatedIds, setUpdatedIds] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [updateStatus, setUpdateStatus] = useState(null);

  const [pipelineStatus, setPipelineStatus] = useState("Not Started");

  const handleAOIChange = (index, field, value) => {
    const updated = [...aoiList];
    updated[index][field] = value;
    setAoiList(updated);
  };

  const addAOI = () =>
    setAoiList([...aoiList, { name: "", polygon: "", driveLink: "" }]);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!executedColab) {
      alert("Please execute the notebook first!");
      return;
    }

    setIsUpdating(true);

    const anyEmpty = aoiList.some(
      (aoi) => !aoi.name || !aoi.polygon || !aoi.driveLink
    );

    if (anyEmpty) {
      setUpdateStatus({
        type: "error",
        msg: "Update failed! Please fill all required fields.",
      });
      setIsUpdating(false);
      return;
    }

    setTimeout(() => {
      setUpdateStatus({
        type: "success",
        msg: "AOIs updated successfully!",
      });
      setIsUpdating(false);
    }, 2000);
  };

  const handleStartInference = () => {
    if (!executedNB || !updatedIds) {
      alert("Please complete all previous steps.");
      return;
    }

    setIsProcessing(true);

    setPipelineStatus("Started");

    setTimeout(() => {
      setPipelineStatus("Processing");
    }, 3000);

    setTimeout(() => {
      setPipelineStatus("Completed");
      setIsProcessing(false);
    }, 9000);
  };

  const isUpdateLocked = !executedColab;
  const isStartLocked = !executedNB || !updatedIds;

  return (
    <div className="!bg-[#031217] !text-white inter-300 !min-h-screen">
      <NavbarComponent isDashboardPage={true} />

      <div className="!px-10 !pt-24 !pb-4 !space-y-12">

        {/* Header Section*/}
        <section className="!mb-10 !px-4">
          <h1 className="!text-3xl !font-semibold !text-white/90 !mb-2">
            Welcome to Jalyoddhe’s Dashboard
          </h1>
          <p className="!text-white/70">
            Manage your AI inference pipeline and update GEE data seamlessly.
          </p>
        </section>

        <section className="!bg-white/10 !backdrop-blur-xl !rounded-4xl !shadow-[0_8px_32px_rgba(0,0,0,0.3)] !p-10 !space-y-10">

          {/* Notebook Execution Section */}
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

          <hr className="!border-t !border-white/60" />

          {/* UPDATE AOIs Section */}
          <div id="update">
            <h2 className="!text-2xl !font-medium !text-white/90 !mb-4">
              Update AOIs
            </h2>

            <form onSubmit={handleUpdate} className="!space-y-5">
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
                        className="!flex-1 !bg-white/10 !rounded-3xl !py-3 !px-6 !border !border-white/10 hover:!bg-white/20"
                      />
                      <input
                        type="text"
                        placeholder="Polygon Coordinates"
                        value={aoi.polygon}
                        onChange={(e) =>
                          handleAOIChange(index, "polygon", e.target.value)
                        }
                        className="!flex-1 !bg-white/10 !rounded-3xl !py-3 !px-6 !border !border-white/10 hover:!bg-white/20"
                      />
                      <input
                        type="text"
                        placeholder="Google Drive Link"
                        value={aoi.driveLink}
                        onChange={(e) =>
                          handleAOIChange(index, "driveLink", e.target.value)
                        }
                        className="!flex-1 !bg-white/10 !rounded-3xl !py-3 !px-6 !border !border-white/10 hover:!bg-white/20"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="!flex !justify-between !items-center">
                <button
                  type="button"
                  onClick={addAOI}
                  className="!text-white/80 hover:!text-white !transition-all"
                >
                  + Add AOI
                </button>

                <div
                  onClick={() => {
                    if (isUpdateLocked) alert("Please execute the notebook first!");
                  }}
                  className={`${isUpdateLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <PrimaryButton
                    type="submit"
                    text="Update"
                    disabled={isUpdating}
                  />
                </div>
              </div>

              {updateStatus && (
                <p
                  className={`!text-sm !mt-3 ${updateStatus.type === "success"
                      ? "!text-green-400"
                      : "!text-red-400"
                    }`}
                >
                  {updateStatus.msg}
                </p>
              )}
            </form>
          </div>

          <hr className="!border-t !border-white/60" />

          {/* START INFERENCE Section */}
          <div id="inference">

            <div className="!flex !justify-between !items-center !mb-6">
              <h2 className="!text-2xl !font-medium !text-white/90">
                Start Inference Pipeline
              </h2>

              <div
                className={`
                  px-6 py-2 rounded-full text-sm font-medium bg-white/10 text-white
                  ${pipelineStatus === "Started" || pipelineStatus === "Processing" ? "heartbeat" : ""}
                `}
              >
                {pipelineStatus}
              </div>
            </div>

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

            <div
              onClick={() => {
                if (isStartLocked)
                  alert("Please complete previous steps before starting inference.");
              }}
              className={`${isStartLocked ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <PrimaryButton
                text="Start Inference Pipeline"
                onClick={handleStartInference}
                disabled={isProcessing}
                fullWidth
              />
            </div>
          </div>

        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
