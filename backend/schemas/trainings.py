from datetime import date as date_type
from typing import List, Optional

from pydantic import BaseModel, Field

from models.trainings import SkillLevel, TrainingStatus, TrainingType
from schemas.athletes import AthleteSimpleResponse


class TrainingPlanBase(BaseModel):
    date: date_type = Field(..., description="Дата тренировки")
    title: str = Field(..., min_length=1, max_length=100, description="Название тренировки")
    training_type: TrainingType
    duration: int = Field(..., ge=1, le=480, description="Продолжительность в минутах (1-480)")
    skill_level: SkillLevel
    description: Optional[str] = Field(default="", description="Описание тренировки")
    athlete_ids: List[int] = Field(default=[], description="ID спортсменов")


class TrainingPlanCreate(TrainingPlanBase):
    pass


class TrainingPlanUpdate(BaseModel):
    date: Optional[date_type] = Field(None, description="Дата тренировки")
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    training_type: Optional[TrainingType] = None
    status: Optional[TrainingStatus] = None
    duration: Optional[int] = Field(None, ge=1, le=480)
    skill_level: Optional[SkillLevel] = None
    description: Optional[str] = None
    athlete_ids: Optional[List[int]] = None


class TrainingPlanResponse(TrainingPlanBase):
    id: int
    status: TrainingStatus
    athletes: List[AthleteSimpleResponse] = Field(description="Список спортсменов")

    class Config:
        from_attributes = True
