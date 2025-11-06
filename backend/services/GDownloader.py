import os
from os.path import dirname as up
from utils.utils import rand_str
import gdown

class GDownloader:
    def __init__(self):
        pass

    def download(self, file_id:str, file_name:str = f"aoi_{rand_str(5)}", format: str = ".tif", destination:str= "aoi"):
        dest_folder = os.path.join(up(up(__file__)), "data", destination)
        if not os.path.exists(dest_folder):
            os.makedirs(dest_folder)
        dest_path = os.path.join(dest_folder, f"{file_name}{format}")
        try:
            file_url = f"https://drive.google.com/uc?id={file_id}"
            gdown.download(file_url, format=format, output=dest_path, quiet=False)
            print(f"File downloaded successfully to {dest_path}")
        except Exception as e:
            print(f"An error occurred while downloading the file: {e}")
        return dest_path
