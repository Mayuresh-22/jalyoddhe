import os
from services.GDownloader import GDownloader
from os.path import dirname as up

class InferencePipeline:
    def __init__(
        self, 
        aoi_name: str = "aoi",
        aoi_filepath:str = None, 
        model_folder:str = "saved_model", 
        tiles_folder:str = "tiles",
        gd:bool = True
        ):
        self.model_filepath = os.path.join(up(up(__file__)), model_folder)
        self.tiles_folder = os.path.join(up(up(__file__)), "data", tiles_folder)
        self.aoi_filepath = aoi_filepath
        
        if gd and self.aoi_filepath is None:
            raise ValueError("AOI filepath must be provided when gd is True.")
        else:
            # downloading actuall AOI file from gdrive
            gd_downloader = GDownloader()
            self.aoi_filepath = gd_downloader.download(file_id=self.aoi_filepath)
        if not os.path.exists(self.tiles_folder):
            os.makedirs(self.tiles_folder)
    
    def tiles_creation_processing(self):
        pass