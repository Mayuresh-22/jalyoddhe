import os
from os.path import dirname as up
from utils.utils import rand_str
from utils.logger import logger
import gdown


class GDownloader:
    def download(
        self,
        file_id: str,
        output_dir: str,
        file_name: str = f"aoi_{rand_str(5)}",
        format: str = ".tif"
    ) -> str:
        if not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)
        dest_path = os.path.join(output_dir, f"{file_name}{format}")
        
        if os.path.exists(dest_path):
            return dest_path

        try:
            gdrive_url = f"https://drive.google.com/uc?id={file_id}"
            gdown.download(gdrive_url, format=format, output=dest_path, quiet=False)
            logger.info(f"File downloaded successfully to {dest_path}")
            return dest_path
        except Exception as e:
            logger.error(f"Failed to download file: {e}")
            raise e
