from typing import Annotated, List
from supabase import Client
from pydantic import BaseModel, Field, field_validator


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


class AOIEntry(BaseModel):
    aoi_name: str = Field(...)
    polygon: List[List[List[float]]] = Field(...)
    file_id: List[str] = Field(...)

class AOIUpdateEntry(BaseModel):
    aois: List[AOIEntry] = Field(...)