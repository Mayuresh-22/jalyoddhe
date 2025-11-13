from typing import Dict, List, Tuple
import os
import torch
from schemas.models import InferencePayload
from services.GDownloader import GDownloader
from services.Tiler import Tiler
from services.Model import Model
from os.path import dirname as up
from utils.logger import logger


class InferencePipeline:
    def __init__(
        self,
        model: Model,
        tiler: Tiler,
        gd_downloader: GDownloader,
        aoi_dir: str = "aoi",
        tiles_dir: str = "tiles",
        gd: bool = True,
    ):
        self.model = model
        self.tiler = tiler
        self.gd_downloader = gd_downloader
        self.aoi_dir = os.path.join(up(up(__file__)), "data", aoi_dir)
        self.gd = gd
        logger.info(
            f"Inference Pipeline initialized with model: {self.model.__str__()}, aoi_dir: {self.aoi_dir}, gd: {self.gd}"
        )

    def download_aoi(self, aoi_file_id: str, aoi_name: str):
        """
            Downloads the AOI file using GDownloader if gd is True.
        """
        if self.gd and aoi_file_id == "":
            raise ValueError("AOI file ID must be provided when gd is True.")
        else:
            logger.info(f"Downloading AOI file: {aoi_name}, file id: {aoi_file_id}...")
            try:
                self.aoi_file_path = self.gd_downloader.download(
                    file_id=aoi_file_id,
                    output_dir=self.aoi_dir,
                    file_name=f"aoi_{aoi_name}",
                    format=".tif"
                )
                logger.info(f"AOI file downloaded to {self.aoi_file_path}")
            except Exception as e:
                logger.error(f"Error downloading AOI file: {e}")
                raise e

    def process_tiles(self, aoi_id: str, aoi_name: str) -> Tuple[List[InferencePayload], Dict]:
        """
            Wrapper method to create tiles from the AOI file and perform inference on them.
        """
        logger.info("Processing tiles from AOI file...")
        try:
            tile_inferences, summary = self.tiler.generate_and_infer_tiles(self.model, aoi_id=aoi_id, aoi_path=self.aoi_file_path)
            summary.update({"detected_tiles": len(tile_inferences)})
            logger.info(f"Tiles processed successfully.")
            return tile_inferences, summary
        except Exception as e:
            logger.error(f"Error during tile processing: {e}")
            raise e

    def get_inference(self, tile: torch.Tensor):
        if tile.shape != (11, 256, 256):
            raise ValueError("Input tile must have shape (11, 256, 256)")
        with torch.no_grad():
            probs = self.model.inference(tile)
        return probs
