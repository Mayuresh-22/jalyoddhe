import { AppEnv } from "./envs";

const API_BASE = AppEnv.API_BASE_URL;

export const getAOIs = async () => {
  try {
    const response = await fetch(`${API_BASE}/aois`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching AOIs:", error);
    throw error;
  }
};

export const getTiles = async (aoiId) => {
  try {
    const response = await fetch(`${API_BASE}/tiles?aoi_id=${aoiId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tiles:", error);
    throw error;
  }
};

export const formatAOIName = (aoiName) => {
  return aoiName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getAdminAOIs = async () => {
  try {
    const response = await fetch(`${API_BASE}/admin/aois`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching admin AOIs:", error);
    throw error;
  }
};

export const updateAdminAOIs = async (aois) => {
  try {
    const response = await fetch(`${API_BASE}/admin/aois`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ aois }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating admin AOIs:", error);
    throw error;
  }
};

export const startPipeline = async () => {
  try {
    const response = await fetch(`${API_BASE}/pipeline/run`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error starting pipeline:", error);
    throw error;
  }
};

export const getPipelineStatus = async (runId) => {
  try {
    const response = await fetch(`${API_BASE}/pipeline/status?run_id=${runId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pipeline status:", error);
    throw error;
  }
};

export const deleteAdminAOI = async (aoiName) => {
  try {
    const response = await fetch(`${API_BASE}/admin/aois?aoi_name=${encodeURIComponent(aoiName)}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting AOI:", error);
    throw error;
  }
};
