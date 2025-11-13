from typing import Annotated, List, Literal, Tuple, Type
from supabase import Client
import torch.nn as nn
from pydantic import BaseModel, Field, field_validator


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


class Prediction(BaseModel):
    labels: List[str] = Field(...)
    confidence: List[float] = Field(...)
    
    @field_validator("labels", mode="after")
    def check_labels(cls, labels):
        if not labels:
            raise ValueError("Labels list is empty")
        if len(labels) > 3:
            raise ValueError("Labels list exceeds maximum length of 3")
        return labels


class InferencePayload(BaseModel):
    aoi_id: str = Field(...)
    bounds: List[float] = Field(..., min_length=4, max_length=4)
    prediction: Prediction = Field(...)


class DBOptions(BaseModel):
    db: Annotated[Client, Field(...)]
    batch_size: int = Field(default=100)
    class Config:
        arbitrary_types_allowed = True
