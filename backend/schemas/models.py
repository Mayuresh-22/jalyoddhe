from typing import Literal, Optional, Type
import torch.nn as nn
from pydantic import BaseModel, Field, field_validator, validator


class ModelEntry(BaseModel):
    path: str
    class_: Type[nn.Module] = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class AvailableModels(BaseModel):
    classification: dict[Literal["resnet50"], ModelEntry]

    class Config:
        arbitrary_types_allowed = True
