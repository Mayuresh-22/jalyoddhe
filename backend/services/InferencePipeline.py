import os
from typing import Optional
from services.GDownloader import GDownloader
from os.path import dirname as up

class InferencePipeline:
    def __init__(
        self, 
        aoi_name: str = "aoi",
        aoi_file_id:str = "", 
        model_folder:str = "saved_model", 
        tiles_folder:str = "tiles",
        gd:bool = True
        ):
        self.model_filepath = os.path.join(up(up(__file__)), model_folder)
        self.tiles_folder = os.path.join(up(up(__file__)), "data", tiles_folder)
        self.aoi_file_id = aoi_file_id

        if gd and self.aoi_file_id == "":
            raise ValueError("AOI file ID must be provided when gd is True.")
        else:
            # downloading actuall AOI file from gdrive
            gd_downloader = GDownloader()
            self.aoi_file_id = gd_downloader.download(file_id=self.aoi_file_id)
        if not os.path.exists(self.tiles_folder):
            os.makedirs(self.tiles_folder)
    
    def tiles_creation_processing(self):
        pass
