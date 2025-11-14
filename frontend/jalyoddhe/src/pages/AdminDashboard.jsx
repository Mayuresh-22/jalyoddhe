import React, { useState, useEffect, useRef } from "react";
import NavbarComponent from "../components/Navbar";
import PrimaryButton from "../components/PrimaryButton";
import { getAdminAOIs, updateAdminAOIs, startPipeline, getPipelineStatus, deleteAdminAOI } from "../utils/api";

const PIPELINE_STORAGE_KEY = "jalyoddhe_pipeline_run_id";
const POLL_INTERVAL = 5000;

const AdminDashboard = () => {
  const [aoiList, setAoiList] = useState([
    { aoi_name: "Vembanad", polygon: "", file_id: "" },
  ]);

  const [executedColab, setExecutedColab] = useState(false);
  const [executedNB, setExecutedNB] = useState(false);
  const [updatedIds, setUpdatedIds] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [updateStatus, setUpdateStatus] = useState(null);
  const [pipelineStatus, setPipelineStatus] = useState("Not Started");
  const [pipelineError, setPipelineError] = useState(null);

  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    const fetchAdminAOIs = async () => {
      try {
        setIsLoading(true);
        const response = await getAdminAOIs();
        if (response.status === "ok" && response.aois && response.aois.length > 0) {
          const formattedAOIs = response.aois.map(aoi => ({
            aoi_name: aoi.aoi_name,
            polygon: JSON.stringify(aoi.polygon),
            file_id: Array.isArray(aoi.file_id) ? aoi.file_id.join(", ") : aoi.file_id,
          }));
          setAoiList(formattedAOIs);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching admin AOIs:", err);
        setIsLoading(false);
      }
    };

    fetchAdminAOIs();

    const savedPipeline = localStorage.getItem(PIPELINE_STORAGE_KEY);
    if (savedPipeline) {
      const { run_id, start_time } = JSON.parse(savedPipeline);
      setIsProcessing(true);
      setPipelineStatus("Processing");
      startPolling(run_id);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const formatStatusDisplay = (status) => {
    const statusMap = {
      "STARTED": "Started",
      "PROCESSING": "Processing",
      "SUCCESS": "Completed",
      "ERROR": "Failed",
    };
    return statusMap[status] || status;
  };

  const startPolling = (runId) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    const pollStatus = async () => {
      try {
        const response = await getPipelineStatus(runId);
        
        if (response.status === "error") {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          setPipelineStatus("Failed");
          setPipelineError(response.message || "Pipeline failed");
          setIsProcessing(false);
          localStorage.removeItem(PIPELINE_STORAGE_KEY);
          return;
        }

        if (response.status) {
          const displayStatus = formatStatusDisplay(response.status);
          setPipelineStatus(displayStatus);

          if (response.status === "success") {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
            setIsProcessing(false);
            localStorage.removeItem(PIPELINE_STORAGE_KEY);
          }
        } else {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          setPipelineStatus("Completed");
          setIsProcessing(false);
          localStorage.removeItem(PIPELINE_STORAGE_KEY);
        }
      } catch (err) {
        console.error("Error polling pipeline status:", err);
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        setPipelineStatus("Failed");
        setPipelineError("Failed to fetch pipeline status");
        setIsProcessing(false);
        localStorage.removeItem(PIPELINE_STORAGE_KEY);
      }
    };

    pollStatus();
    pollingIntervalRef.current = setInterval(pollStatus, POLL_INTERVAL);
  };

  const handleAOIChange = (index, field, value) => {
    const updated = [...aoiList];
    updated[index][field] = value;
    setAoiList(updated);
  };

  const addAOI = () =>
    setAoiList([...aoiList, { aoi_name: "", polygon: "", file_id: "" }]);

  // DELETE AOI ROW
  const handleDeleteAOI = async (index) => {
    const aoiToDelete = aoiList[index];
    
    if (!aoiToDelete.aoi_name) {
      // If aoi_name is empty, just remove from local state
      const updated = [...aoiList];
      updated.splice(index, 1);
      setAoiList(updated);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete AOI "${aoiToDelete.aoi_name}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      const response = await deleteAdminAOI(aoiToDelete.aoi_name);
      
      if (response.status === "ok") {
        // Remove from local state on success
        const updated = [...aoiList];
        updated.splice(index, 1);
        setAoiList(updated);
        
        setUpdateStatus({
          type: "success",
          msg: response.message || "AOI deleted successfully!",
        });
      } else {
        setUpdateStatus({
          type: "error",
          msg: response.message || "Failed to delete AOI",
        });
      }
    } catch (err) {
      console.error("Error deleting AOI:", err);
      setUpdateStatus({
        type: "error",
        msg: "Failed to delete AOI. Please try again.",
      });
    }
  };

  // -------------------------
  // UPDATE AOIs
  // -------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!executedColab) {
      alert("Please execute the notebook first!");
      return;
    }

    setIsUpdating(true);
    setUpdateStatus(null);

    const anyEmpty = aoiList.some(
      (aoi) => !aoi.aoi_name || !aoi.polygon || !aoi.file_id
    );

    if (anyEmpty) {
      setUpdateStatus({
        type: "error",
        msg: "Update failed! Please fill all required fields.",
      });
      setIsUpdating(false);
      return;
    }

    try {
      const formattedAOIs = aoiList.map(aoi => ({
        aoi_name: aoi.aoi_name,
        polygon: JSON.parse(aoi.polygon),
        file_id: aoi.file_id.split(",").map(id => id.trim()),
      }));

      const response = await updateAdminAOIs(formattedAOIs);

      if (response.status === "ok") {
        setUpdateStatus({
          type: "success",
          msg: response.message || "AOIs updated successfully!",
        });
      } else {
        setUpdateStatus({
          type: "error",
          msg: response.message || "Failed to update AOIs",
        });
      }
    } catch (err) {
      console.error("Error updating AOIs:", err);
      setUpdateStatus({
        type: "error",
        msg: "Failed to update AOIs. Please check your input and try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // -------------------------
  // START INFERENCE
  // -------------------------
  const handleStartInference = async () => {
    if (!executedNB || !updatedIds) {
      alert("Please complete all previous steps.");
      return;
    }

    setIsProcessing(true);
    setPipelineStatus("Starting");
    setPipelineError(null);

    try {
      const response = await startPipeline();

      if (response.status === "ok" && response.run_id) {
        const pipelineData = {
          run_id: response.run_id,
          start_time: new Date().toISOString(),
        };
        localStorage.setItem(PIPELINE_STORAGE_KEY, JSON.stringify(pipelineData));
        
        setPipelineStatus("Started");
        startPolling(response.run_id);
      } else {
        setPipelineStatus("Failed");
        setPipelineError(response.message || "Failed to start pipeline");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Error starting pipeline:", err);
      setPipelineStatus("Failed");
      setPipelineError("Failed to start pipeline. Please try again.");
      setIsProcessing(false);
    }
  };

  const isUpdateLocked = !executedColab;
  const isStartLocked = !executedNB || !updatedIds;

  return (
    <div className="!bg-[#031217] !text-white inter-300 !min-h-screen">
      <NavbarComponent isDashboardPage={true} />

      <div className="px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 pb-6 space-y-12">

        {/* Header Section*/}
        <section className="mb-10">
          <h1 className="!text-3xl !font-semibold !text-white/90 !mb-2">
            Welcome to Jalyoddhe’s Dashboard
          </h1>
          <p className="!text-white/70">
            Manage your AI inference pipeline and update GEE data seamlessly.
          </p>
        </section>

        <section className="bg-white/10 backdrop-blur-xl rounded-4xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 md:p-10 space-y-10">

          {isLoading && (
            <div className="text-center text-white/70 py-4">
              <p>Loading AOI data...</p>
            </div>
          )}

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
                  <div key={index} className="!flex !items-center !gap-3">

                    {/* INPUT FIELDS */}
                    <div className="!flex !flex-col md:!flex-row !gap-3 !flex-1">
                      <input
                        type="text"
                        placeholder="AOI Name (e.g., vembanad)"
                        value={aoi.aoi_name}
                        onChange={(e) =>
                          handleAOIChange(index, "aoi_name", e.target.value)
                        }
                        className="!flex-1 !bg-white/10 !rounded-3xl !py-3 
                                   !px-6 !border !border-white/10 hover:!bg-white/20"
                      />

                      <input
                        type="text"
                        placeholder="Polygon Coordinates"
                        value={aoi.polygon}
                        onChange={(e) =>
                          handleAOIChange(index, "polygon", e.target.value)
                        }
                        className="!flex-1 !bg-white/10 !rounded-3xl !py-3 
                                   !px-6 !border !border-white/10 hover:!bg-white/20"
                      />

                      <input
                        type="text"
                        placeholder="File IDs (comma-separated)"
                        value={aoi.file_id}
                        onChange={(e) =>
                          handleAOIChange(index, "file_id", e.target.value)
                        }
                        className="!flex-1 !bg-white/10 !rounded-3xl !py-3 
                                   !px-6 !border !border-white/10 hover:!bg-white/20"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAOI(index)}
                      className="
                          !w-10 !h-10 !flex !items-center !justify-center
                          !rounded-full 
                          !bg-[rgba(255,0,0,0.12)] 
                          hover:!bg-[rgba(255,0,0,0.25)]
                          !backdrop-blur-xl 
                          !border !border-[rgba(255,255,255,0.1)]
                          !transition-all !duration-200
                          !font-semibold !text-white/80
                        "
                    >
                      ✕
                    </button>


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

            {pipelineError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                <p className="text-red-400 text-sm">{pipelineError}</p>
              </div>
            )}

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
