import os
from uuid import uuid4
import numpy as np
import rasterio
from rasterio.windows import Window
import rasterio.windows
import torch
from utils.env import Env
from schemas.models import InferencePayload, Prediction
from typing import List, Tuple
from services.Model import Model
from utils.logger import logger
from tqdm import tqdm


class Tiler:
    def __init__(self, tile_size: int = 256):
        self.tile_size = tile_size
        self.mndwi_threshold = 0.0
        self.threshold = Env.PER_CLASS_THRESHOLD
        self.classified_tiles = {"water": 0, "non_water": 0}

    def generate_and_infer_tiles(
        self, model: Model, aoi_id: str, aoi_path: str, output_dir: str
    ) -> List[InferencePayload]:
        """
        This method now create tiles and predict on each tile,
        combining both functionalities for efficiency.
        """
        os.makedirs(output_dir, exist_ok=True)
        tile_inferences: List[InferencePayload] = []

        try:
            with rasterio.open(aoi_path) as src:
                width, height = src.width, src.height
                profile = src.profile

                # only for progress bar calculation
                n_cols = width / self.tile_size
                n_rows = height / self.tile_size
                total = n_cols * n_rows

                with tqdm(total=total, desc="Creating tiles", unit=" tile") as pbar:
                    for i in range(0, width, self.tile_size):
                        for j in range(0, height, self.tile_size):
                            # Define tile window, x, y, width, height
                            window = Window(i, j, self.tile_size, self.tile_size)  # type: ignore
                            data = src.read(window=window)

                            # Only infer non-empty tiles
                            # If B4, B3, B2 contain NaNs, skip the tile
                            logger.debug(
                                f"Checking tile at position ({i}, {j}) for NaN values in B4, B3, B2"
                            )
                            if (
                                np.isnan(np.mean(data[2, :, :]))
                                or np.isnan(np.mean(data[3, :, :]))
                                or np.isnan(np.mean(data[4, :, :]))
                            ):
                                continue

                            # If MNDWI > threshold, it is water tile
                            mean_mndwi = np.mean(self._cal_mndwi(data))
                            logger.debug(
                                f"Mean MNDWI for tile at ({i}, {j}): {mean_mndwi}"
                            )
                            if mean_mndwi > self.mndwi_threshold:
                                self.classified_tiles["water"] += 1

                                window_bounds = rasterio.windows.bounds(
                                    window, src.transform
                                )
                                tile_name = f"tile_{i}_{j}.tif"
                                logger.debug(
                                    f"\nProcessing {tile_name}, geospatial coords: {window_bounds}"
                                )

                                tile_tensor = (
                                    torch.from_numpy(data).unsqueeze(0).float()  # type: ignore
                                )

                                probs = model.inference(tile_tensor)
                                probs = probs.squeeze(0)

                                predicted_labels, index = self.get_labels(
                                    (probs >= self.threshold).astype(int)
                                )
                                if len(predicted_labels) > 0:
                                    # TODO: Store inference result in DB
                                    tile_inferences.append(
                                        InferencePayload(
                                            aoi_id=aoi_id,
                                            bounds=list(window_bounds),
                                            prediction=Prediction(
                                                labels=predicted_labels,
                                                confidence=[float(probs[idx]) for idx in index],
                                            ),
                                        )
                                    )

                            else:
                                self.classified_tiles["non_water"] += 1
                            pbar.update(1)
            logger.info(f"Tile classification summary: {self.classified_tiles}")
            return tile_inferences
        except Exception as e:
            logger.error(f"An error occurred while creating tiles: {e}")
            raise e

    def get_labels(self, result: np.ndarray) -> Tuple[List[str], List[int]]:
        labels = []
        index = []
        LABELS = Env.LABELS
        ALLOWED_LABEL_INDEX = Env.ALLOWED_LABEL_INDEX
        # print("Result array from model: ", result)
        for idx, val in enumerate(result):
            if val == 1 and idx in ALLOWED_LABEL_INDEX:
                labels.append(LABELS[idx])
                index.append(idx)
        return labels, index

    def _cal_mndwi(self, tile):
        """Calculates Modified Normalized Difference Water Index (MNDWI).\n
        More info: https://en.wikipedia.org/wiki/Normalized_difference_water_index"""
        # B3 (Green) is band index 2, B11 (SWIR) is band index 9
        green = tile[2, :, :]
        swir = tile[9, :, :]

        numerator = green - swir
        denominator = green + swir

        mndwi = np.where(denominator == 0, np.nan, numerator / denominator)
        return mndwi
