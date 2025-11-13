# Table names
AOI_TABLE: str = "aoi"
TILE_TABLE: str = "tile"
RUN_TABLE: str = "run"

# Column names
AOI_ID_COLUMN: str = "aoi_id"
TILE_ID_COLUMN: str = "tile_id"
FILE_ID_COLUMN: str = "file_id"
RUN_ID_COLUMN: str = "run_id"
AOI_NAME_COLUMN: str = "aoi_name"
BOUNDS_COLUMN: str = "bounds"
STATUS_COLUMN: str = "status"
SUMMARY_COLUMN: str = "summary"
FINISHED_AT_COLUMN: str = "finished_at"
PREDICTION_COLUMN: str = "prediction"
LAST_UPDATED_COLUMN: str = "last_updated"

# Pipeline statuses
STATUS_STARTED: str = "STARTED"
STATUS_IN_PROGRESS: str = "IN_PROGRESS"
STATUS_DOWNLOADING_AOI: str = "DOWNLOADING_AOI"
STATUS_INFERENCING: str = "INFERENCING"
STATUS_SAVING_RESULTS: str = "SAVING_RESULTS"
STATUS_COMPLETED: str = "COMPLETED"