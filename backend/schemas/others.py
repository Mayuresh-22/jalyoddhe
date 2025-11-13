from typing import Literal
from pydantic import BaseModel, Field
import torch.nn as nn


class ModelEntry(BaseModel):
    path: str = Field(...)
    class_: type[nn.Module] = Field(...)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True


class AvailableModels(BaseModel):
    classification: dict[Literal["resnet50"], ModelEntry]

    class Config:
        arbitrary_types_allowed = True