import uuid
import modal

from db.services.LogService import LogService
import nn_models
from utils.const import (
    STATUS_COMPLETED,
    STATUS_DOWNLOADING_AOI,
    STATUS_IN_PROGRESS,
    STATUS_INFERENCING,
    STATUS_SAVING_RESULTS,
)

app = modal.App("jalyoddhe-inference-pipeline")

app_image = (
    modal.Image.debian_slim(python_version="3.12")
    .uv_pip_install(
        "gdown>=5.2.0",
        "numpy>=2.3.4",
        "pillow>=12.0.0",
        "python-dotenv>=1.2.1",
        "rasterio>=1.4.3",
        "supabase>=2.24.0",
        "torch>=2.9.0",
        "torchvision>=0.24.0",
        "tqdm>=4.67.1",
    )
    .add_local_python_source(
        "db",
        "nn_models",
        "schemas",
        "services",
        "utils",
        ignore=["__pycache__", "*.pyc"],
    )
)

app_secrets = modal.Secret.from_name("jalyoddhe-secrets")
app_volume = modal.Volume.from_name("jalyoddhe-cache", create_if_missing=True)


@app.function(image=app_image, secrets=[app_secrets], volumes={"/root/.cache/": app_volume}, timeout=3600)
def start_pipeline(run_id: str):
    """
        Main entry point for the inference pipeline.
        Args:
            run_id (str): Pipelines run ID same as DB
    """
    from db.services.AOIService import AOIService
    from db.conn import db
    from db.services.InferenceService import InferenceService
    from schemas.models import DBOptions
    from utils.logger import logger
    from services.Tiler import Tiler
    from services.GDownloader import GDownloader
    from services.InferencePipeline import InferencePipeline
    from services.Model import Model
    
    db_options = DBOptions(db=db)
    db_logger = LogService(run_id=run_id, options=db_options)

    try:
        logger.info("Starting inference pipeline...")

        db_logger.log(status=STATUS_IN_PROGRESS)
        model = Model(task="classification", model_type="resnet50")
        tiler = Tiler()
        gd_downloader = GDownloader()
        pipe = InferencePipeline(model=model, tiler=tiler, gd_downloader=gd_downloader)
              
        all_aois = AOIService().get_aois(db_options)
        global_summary = {}

        if all_aois is None:
            logger.error("No AOIs found in the database.")
            exit(1)

        logger.info(f"AOIs: {all_aois}")

        for aoi in all_aois:
            aoi_id, aoi_name, file_ids = tuple(aoi.values())  # type:ignore
            logger.info(f"Processing AOI: {aoi_name} with ID: {aoi_id}")

            for index, file_id in enumerate(file_ids):  # type:ignore
                db_logger.log(status=STATUS_DOWNLOADING_AOI)
                pipe.download_aoi(file_id, f"{aoi_name}_part_{index}")

                db_logger.log(status=STATUS_INFERENCING)
                inferences, summary = pipe.process_tiles(
                    str(aoi_id), f"{aoi_name}_part_{index}"
                )
                global_summary.update({f"{aoi_name}_part_{index}": summary})

                if len(inferences) == 0:
                    logger.warning(f"No inferences generated for AOI: {aoi_name}, part: {index}")
                    continue
                db_logger.log(status=STATUS_SAVING_RESULTS)
                InferenceService().upsert_in_batch(inferences, db_options)

        db_logger.log(
            status=STATUS_COMPLETED,
            summary=global_summary,
            finished=True,
        )
        logger.info("Inference pipeline completed successfully.")
        return {
            "status": "success",
            "summary": global_summary,
            "message": "Inference pipeline completed successfully.",
        }
    except Exception as e:
        logger.error(f"Error in inference pipeline: {e}")
        db_logger.log(
            status="ERROR",
            finished=True
        )
        return {
            "status": "error",
            "message": f"Error in inference pipeline: {e}",
        }


@app.local_entrypoint()
def main():
    start_pipeline.remote(str(uuid.uuid1()))