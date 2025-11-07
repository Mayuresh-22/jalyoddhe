import os
from typing import Optional
from services.GDownloader import GDownloader
from services.Tiler import Tiler
from os.path import dirname as up

from utils.logger import logger

class InferencePipeline:
    def __init__(
        self, 
        aoi_name: str = "",
        aoi_file_id:str = "", 
        model_dir:str = "saved_model", 
        tiles_dir:str = "tiles",
        gd:bool = True
        ):
        self.model_dir = os.path.join(up(up(__file__)), model_dir)
        self.tiles_dir = os.path.join(up(up(__file__)), "data", tiles_dir)
        self.aoi_dir = os.path.join(up(up(__file__)), "data", "aoi")
        self.aoi_file_id = aoi_file_id
        self.aoi_name = aoi_name
        self.gd = gd
        logger.info(f"Inference Pipeline initialized with model_dir: {self.model_dir}, tiles_dir: {self.tiles_dir}, aoi_name: {self.aoi_name}, gd: {self.gd}")

    def download_aoi(self):
        if self.gd and self.aoi_file_id == "":
            raise ValueError("AOI file ID must be provided when gd is True.")
        else:
            logger.info("Downloading AOI file...")
            # downloading actuall AOI file from gdrive
            try:
                gd_downloader = GDownloader()
                self.aoi_file_path = gd_downloader.download(
                    file_id=self.aoi_file_id,
                    file_name=f"aoi_{self.aoi_name}",
                    format=".tif",
                    output_dir=self.aoi_dir
                )
                logger.info(f"AOI file downloaded to {self.aoi_file_path}")
            except Exception as e:
                logger.error(f"Error downloading AOI file: {e}")
    
    def tiles_creation_processing(self):
        if not os.path.exists(self.tiles_dir):
            os.makedirs(self.tiles_dir, exist_ok=True)
        logger.info("Creating tiles from AOI file...")
        _output_dir = os.path.join(self.tiles_dir, self.aoi_name)
        try:
            tiler = Tiler()
            tiler.create_tiles(
                aoi_path=self.aoi_file_path,
                output_dir=_output_dir
            )
            logger.info(f"Tiles created successfully at {_output_dir}")
        except Exception as e:
            logger.error(f"Error during tiling process: {e}")
