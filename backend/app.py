from datetime import datetime as dt, timezone
from uuid import uuid1
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import modal
from db.services.RunService import RunService
from db.conn import db as db_conn
from schemas.models import AOIUpdateEntry, DBOptions, LoginPayload
from utils.const import (
    AOI_ID_COLUMN,
    AOI_NAME_COLUMN,
    AOI_TABLE,
    BOUNDS_COLUMN,
    CALL_ID_COLUMN,
    STARTED_AT_COLUMN,
    FILE_IDS_COLUMN,
    FINISHED_AT_COLUMN,
    LAST_UPDATED_COLUMN,
    POLYGON_COLUMN,
    PREDICTION_COLUMN,
    RUN_ID_COLUMN,
    RUN_TABLE,
    STATUS_COLUMN,
    STATUS_STARTED,
    TILE_ID_COLUMN,
    TILE_TABLE,
)
from utils.env import Env
from utils.logger import logger

app = modal.App("jalyoddhe-backend")
app_image = (
    modal.Image.debian_slim(python_version="3.12")
    .uv_pip_install(
        "fastapi[standard]>=0.121.0", "python-dotenv>=1.2.1", "supabase>=2.24.0"
    )
    .add_local_python_source("db", "schemas", "utils", ignore=["__pycache__", "*.pyc"])
)
app_secrets = modal.Secret.from_name("jalyoddhe-secrets")

db_options = DBOptions(db=db_conn)

web_app = FastAPI()
# CORS middleware
web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
ENV = Env.SCRIPT_ENV


@web_app.get("/")
def hello():
    return {"status": "ok"}


@web_app.post("/api/admin/login")
def admin_login(payload: LoginPayload):
    """
    Simple admin login endpoint.
    """
    logger.info(f"Admin login attempt for email: {payload.email}")
    if payload.email == Env.ADMIN_EMAIL and payload.secret_key == Env.ADMIN_SECRET_KEY:
        logger.info("Admin login successful")
        return JSONResponse({"status": "ok", "message": "Login successful"}, status_code=200)
    else:
        logger.warning("Admin login failed")
        return JSONResponse({"status": "error", "message": "Invalid credentials"}, status_code=401)


@web_app.post("/api/pipeline/run")
def run_pipeline():
    """
    Starts a new pipeline run if the last run was more than 6 days ago.
    """
    logger.info("Received request to start new pipeline run")
    last_run = RunService("", options=db_options).get_last_run()
    if last_run is not None and ENV != "LOCAL":
        logger.info("Checking time since last pipeline run")

        last_run_finished_at = last_run[FINISHED_AT_COLUMN]  # type: ignore
        if last_run_finished_at is None:
            last_run_finished_at = last_run[STARTED_AT_COLUMN]  # type: ignore

        # check the time difference, btwn last finished run and now
        last_finished = dt.fromisoformat(last_run_finished_at)  # type: ignore
        diff = dt.now(timezone.utc) - last_finished
        if diff.total_seconds() < 3600 * 24 * 6:  # 6 days
            logger.info(
                "Last pipeline run was less than 6 days ago. Rejecting new run request."
            )
            return {
                "status": "error",
                "message": "Last pipeline run was less than 6 days ago. Please wait before starting a new run.",
            }

    logger.info("Starting new pipeline run")
    queryClient = db_options.db
    run_id = str(uuid1())

    start_pipeline_job = modal.Function.from_name(
        "jalyoddhe-inference-pipeline", "start_pipeline"
    )
    call = start_pipeline_job.spawn(run_id)
    logger.info(f"Started new pipeline job: {call}")

    queryClient.table(RUN_TABLE).insert(
        {
            RUN_ID_COLUMN: run_id,
            CALL_ID_COLUMN: call.object_id,
            STATUS_COLUMN: STATUS_STARTED,
        }
    ).execute()
    logger.info(f"Logged new pipeline run in database with run_id: {run_id}")
    return JSONResponse({"status": "ok", RUN_ID_COLUMN: run_id})


@web_app.get("/api/pipeline/status")
def get_pipeline_status(run_id: str):
    """
    Fetches the status of a pipeline run given its run_id.
    """
    queryClient = db_options.db

    logger.info(f"Fetching pipeline status for run_id: {run_id}")
    try:
        result = (
            queryClient.table(RUN_TABLE)
            .select(CALL_ID_COLUMN, STATUS_COLUMN)
            .eq(RUN_ID_COLUMN, run_id)
            .execute()
        )

        record = result.data
        if not record or len(record) == 0:
            logger.error(f"No run record found for run_id {run_id}")
            return JSONResponse(
                {"status": "error", "message": "Invalid run_id"}, status_code=400
            )

        logger.info(f"Run record found for run_id {run_id}: {record}")
        record = record[0]
        function_call = modal.functions.FunctionCall.from_id(record[CALL_ID_COLUMN])  # type: ignore
        try:
            logger.info(
                f"Fetching result for function call ID: {record[CALL_ID_COLUMN]}"  # type: ignore
            )
            result = function_call.get(timeout=0)
        except TimeoutError:
            logger.info(f"Function call still running for run_id {run_id}")
            return JSONResponse(
                {
                    "status": record[STATUS_COLUMN]  # type: ignore
                },
                status_code=202,
            )

        logger.info(f"Function call completed for run_id {run_id}")
        return JSONResponse(result, status_code=200)
    except Exception as e:
        logger.error(f"Error fetching pipeline status for run_id {run_id}: {e}")
        return JSONResponse(
            {"status": "error", "message": "Internal server error"}, status_code=500
        )


@web_app.get("/api/aois")
def get_aois():
    """
    Fetches all AOI entries from the database with basic information.
    """
    queryClient = db_options.db

    try:
        result = (
            queryClient.table(AOI_TABLE)
            .select(AOI_ID_COLUMN, AOI_NAME_COLUMN)
            .execute()
        )
        records = result.data
        return JSONResponse({"status": "ok", "aois": records}, status_code=200)
    except Exception as e:
        logger.error(f"Error fetching AOIs: {e}")
        return JSONResponse(
            {"status": "error", "message": "Internal server error"}, status_code=500
        )


@web_app.get("/api/admin/aois")
def get_aois_admin():
    """
    Fetches all AOI entries from the database with detailed information. (Admin only)
    """
    queryClient = db_options.db

    try:
        result = (
            queryClient.table(AOI_TABLE)
            .select(AOI_NAME_COLUMN, POLYGON_COLUMN, FILE_IDS_COLUMN)
            .execute()
        )
        records = result.data
        return JSONResponse({"status": "ok", "aois": records}, status_code=200)
    except Exception as e:
        logger.error(f"Error fetching AOIs: {e}")
        return JSONResponse(
            {"status": "error", "message": "Internal server error"}, status_code=500
        )


@web_app.post("/api/admin/aois")
def update_aois(aois: AOIUpdateEntry):
    """
    Upserts AOI entries into the database. (Admin only)
    """
    queryClient = db_options.db

    try:
        queryClient.table(AOI_TABLE).upsert(
            [aoi.model_dump() for aoi in aois.aois], on_conflict=AOI_NAME_COLUMN
        ).execute()
        return JSONResponse(
            {"status": "ok", "message": "AOIs updated successfully"}, status_code=200
        )
    except Exception as e:
        logger.error(f"Error updating AOIs: {e}")
        return JSONResponse(
            {"status": "error", "message": "Internal server error"}, status_code=500
        )


@web_app.delete("/api/admin/aois")
def delete_aoi(aoi_name: str):
    """
    Deletes an AOI entry from the database by name. (Admin only)
    """
    queryClient = db_options.db

    try:
        queryClient.table(AOI_TABLE).delete().eq(AOI_NAME_COLUMN, aoi_name).execute()
        return JSONResponse(
            {"status": "ok", "message": "AOI deleted successfully"}, status_code=200
        )
    except Exception as e:
        logger.error(f"Error deleting AOI {aoi_name}: {e}")
        return JSONResponse(
            {"status": "error", "message": "Internal server error"}, status_code=500
        )


@web_app.get("/api/tiles")
def get_tiles(aoi_id: str):
    queryClient = db_options.db

    try:
        result = (
            queryClient.table(TILE_TABLE)
            .select(
                TILE_ID_COLUMN, PREDICTION_COLUMN, BOUNDS_COLUMN, LAST_UPDATED_COLUMN
            )
            .eq(AOI_ID_COLUMN, aoi_id)
            .execute()
        )
        records = result.data
        return JSONResponse({"status": "ok", "tiles": records}, status_code=200)
    except Exception as e:
        logger.error(f"Error fetching tiles for AOI {aoi_id}: {e}")
        return JSONResponse(
            {"status": "error", "message": "Internal server error"}, status_code=500
        )


# Wrapper method for modal deployment
@app.function(image=app_image, secrets=[app_secrets])
@modal.concurrent(max_inputs=100)
@modal.asgi_app()
def web_app_wrapper():
    return web_app
