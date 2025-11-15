from datetime import date as date_type
from typing import Optional

from pydantic import BaseModel, Field, validator


class ReportBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="Название отчета")
    start_date: date_type = Field(..., description="Дата начала периода")
    end_date: date_type = Field(..., description="Дата конца периода")
    created_date: date_type = Field(..., description="Дата создания отчета")
    attendance: int = Field(..., ge=0, le=100, description="Посещаемость в процентах")
    trainings: int = Field(..., ge=0, description="Количество тренировок")
    skips: int = Field(..., ge=0, description="Количество пропусков")
    participants: int = Field(..., ge=0, description="Количество участников")

    @validator("end_date")
    def validate_dates(cls, v, values):
        if "start_date" in values and v < values["start_date"]:
            raise ValueError("Дата конца периода не может быть раньше даты начала")
        return v


class ReportCreate(ReportBase):
    pass


class ReportUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    start_date: Optional[date_type] = Field(None, description="Дата начала периода")
    end_date: Optional[date_type] = Field(None, description="Дата конца периода")
    created_date: Optional[date_type] = Field(None, description="Дата создания отчета")
    attendance: Optional[int] = Field(None, ge=0, le=100)
    trainings: Optional[int] = Field(None, ge=0)
    skips: Optional[int] = Field(None, ge=0)
    participants: Optional[int] = Field(None, ge=0)


class ReportResponse(ReportBase):
    id: int

    class Config:
        from_attributes = True
