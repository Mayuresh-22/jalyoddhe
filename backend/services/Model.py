import os
from os.path import dirname as up
from typing import Literal
import torch
from nn_models.classification.resnet import ResNet
from schemas.models import AvailableModels, ModelEntry
from utils.env import Env
from utils.logger import logger

SAVED_MODELS_DIR = os.path.join(up(up(__file__)), "saved_models") if Env.SCRIPT_ENV == "LOCAL" else os.path.join(Env.CACHE_DIR, "saved_models")

available_models = AvailableModels(
    classification={
        "resnet50": ModelEntry(
            path=os.path.join(SAVED_MODELS_DIR, Env.RESNET_MODEL_NAME), class_=ResNet
        )
    }
)


class Model:
    def __init__(
        self, task: Literal["classification"], model_type: Literal["resnet50"]
    ):
        self.task = task
        self.model_type = model_type
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        torch.hub.set_dir(os.path.join(Env.CACHE_DIR, "torch_hub"))

        logger.info(
            f"Initializing Model with task: {self.task}, model_type: {self.model_type}, device: {self.device}"
        )
        self.load_model()
        logger.info(f"Model loaded successfully on device: {self.device}")
        
    def __str__(self) -> str:
        return f"Model(task={self.task}, model_type={self.model_type}, device={self.device})"

    def load_model(self):
        model_config = None
        if self.task == "classification":
            model_config = available_models.classification["resnet50"]
            logger.info(f"Model configuration found: {model_config}")
        if model_config is None:
            raise ValueError(
                f"Model type: {self.model_type} for task: {self.task} not found."
            )
        self.model = model_config.class_(input_bands=11, output_classes=11)
        self.model.to(self.device)
        model_path = model_config.path
        self.model.load_state_dict(
            torch.load(model_path, weights_only=True, map_location=self.device)
        )

        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        self.model.eval()

    def inference(self, tile: torch.Tensor):
        with torch.no_grad():
            tile.to(self.device)
            logits = self.model(tile)
            probs = torch.sigmoid(logits).cpu().numpy()
        return probs
