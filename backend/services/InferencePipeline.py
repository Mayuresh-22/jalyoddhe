import os
from typing import Optional

import torch
from services.GDownloader import GDownloader
from services.Tiler import Tiler
from services.Model import Model
from os.path import dirname as up
import torch.nn as nn
from utils.logger import logger


class InferencePipeline:
    def __init__(
        self,
        model: nn.Module,
        aoi_dir: str = "aoi",
        tiles_dir: str = "tiles",
        gd: bool = True,
    ):
        self.model = model
        self.tiles_dir = os.path.join(up(up(__file__)), "data", tiles_dir)
        self.aoi_dir = os.path.join(up(up(__file__)), "data", aoi_dir)
        self.gd = gd
        logger.info(
            f"Inference Pipeline initialized with model: {self.model.__str__}, tiles_dir: {self.tiles_dir}, aoi_dir: {self.aoi_dir}, gd: {self.gd}"
        )

    def download_aoi(self, aoi_file_id: str, aoi_name: str):
        if self.gd and aoi_file_id == "":
            raise ValueError("AOI file ID must be provided when gd is True.")
        else:
            logger.info("Downloading AOI file...")
            # downloading actuall AOI file from gdrive
            try:
                gd_downloader = GDownloader()
                self.aoi_file_path = gd_downloader.download(
                    file_id=aoi_file_id,
                    file_name=f"aoi_{aoi_name}",
                    format=".tif",
                    output_dir=self.aoi_dir,
                )
                logger.info(f"AOI file downloaded to {self.aoi_file_path}")
            except Exception as e:
                logger.error(f"Error downloading AOI file: {e}")

    def tiles_creation_processing(self, aoi_name: str):
        if not os.path.exists(self.tiles_dir):
            os.makedirs(self.tiles_dir, exist_ok=True)
        logger.info("Creating tiles from AOI file...")
        _output_dir = os.path.join(self.tiles_dir, aoi_name)
        try:
            tiler = Tiler()
            tiler.create_tiles(aoi_path=self.aoi_file_path, output_dir=_output_dir)
            logger.info(f"Tiles created successfully at {_output_dir}")
        except Exception as e:
            logger.error(f"Error during tiling process: {e}")

    def get_inference(self, tile: torch.Tensor):
        if tile.shape != (11, 256, 256):
            raise ValueError("Input tile must have shape (11, 256, 256)")
        with torch.no_grad():
            probs = self.model(tile)
        return probs
