from typing import List, Literal, Tuple, Type
import torch.nn as nn
from pydantic import BaseModel, Field, field_validator


class ModelEntry(BaseModel):
    path: str = Field(...)
    class_: Type[nn.Module] = Field(...)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True


class AvailableModels(BaseModel):
    classification: dict[Literal["resnet50"], ModelEntry]

    class Config:
        arbitrary_types_allowed = True


class Prediction(BaseModel):
    labels: List[str] = Field(...)
    confidence: float = Field(...)
    
    @field_validator("labels", mode="after")
    def check_labels(cls, labels):
        if not labels:
            raise ValueError("Labels list is empty")
        if len(labels) > 3:
            raise ValueError("Labels list exceeds maximum length of 3")
        return labels


class InferenceResult(BaseModel):
    tile_id: str = Field(...)
    tile_name: str = Field(...)
    aoi_id: str = Field(...)
    bounds: Tuple[float, float, float, float] = Field(...)
    prediction: Prediction = Field(...)
