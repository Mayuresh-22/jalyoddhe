import os
from typing import Optional
import numpy as np
import rasterio
from rasterio.windows import Window
from PIL import Image
import rasterio.windows

from utils.logger import logger


class Tiler:
    def __init__(self, tile_size: int = 256):
        self.tile_size = tile_size

    def create_tiles(self, aoi_path: str, output_dir: str):
        os.makedirs(output_dir, exist_ok=True)
        try:
            with rasterio.open(aoi_path) as src:
                width, height = src.width, src.height
                profile = src.profile

                for i in range(0, width, self.tile_size):
                    for j in range(0, height, self.tile_size):
                        # Define tile window, x, y, width, height
                        window = Window(i, j, self.tile_size, self.tile_size)  # type: ignore
                        data = src.read(window=window)

                        # Only save complete 256×256 tiles
                        if (
                            data.shape[1] == self.tile_size
                            and data.shape[2] == self.tile_size
                        ):
                            tile_profile = profile.copy()
                            tile_profile.update(
                                {
                                    "width": self.tile_size,
                                    "height": self.tile_size,
                                    "transform": rasterio.windows.transform(
                                        window, src.transform
                                    ),
                                }
                            )

                            tile_name = f"tile_{i}_{j}.tif"
                            tile_path = os.path.join(output_dir, tile_name)

                            with rasterio.open(tile_path, "w", **tile_profile) as dst:
                                dst.write(data)
        except Exception as e:
            logger.error(f"An error occurred while creating tiles: {e}")
            raise e
