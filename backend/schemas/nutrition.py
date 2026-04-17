from typing import List, Optional

from pydantic import BaseModel, Field

from models.nutrition import NutritionStatus, NutritionType
from schemas.athletes import AthleteSimpleResponse


class NutritionPlanBase(BaseModel):
    title: str = Field(
        ..., min_length=1, max_length=100, description="Название плана питания"
    )
    nutrition_type: NutritionType
    calories: int = Field(..., ge=1, le=10000, description="Калорийность в ккал")
    protein: int = Field(..., ge=1, le=500, description="Белки в граммах")
    fats: int = Field(..., ge=1, le=500, description="Жиры в граммах")
    carbs: int = Field(..., ge=1, le=1000, description="Углеводы в граммах")
    period_weeks: int = Field(..., ge=1, le=52, description="Период в неделях")
    breakfast: str = Field(..., min_length=1, description="Описание завтрака")
    lunch: str = Field(..., min_length=1, description="Описание обеда")
    dinner: str = Field(..., min_length=1, description="Описание ужина")
    description: str = Field(default="", description="Описание плана питания")
    athlete_ids: List[int] = Field(default=[], description="ID спортсменов")


class NutritionPlanCreate(NutritionPlanBase):
    pass


class NutritionPlanUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    status: Optional[NutritionStatus] = None
    nutrition_type: Optional[NutritionType] = None
    calories: Optional[int] = Field(None, ge=1, le=10000)
    protein: Optional[int] = Field(None, ge=1, le=500)
    fats: Optional[int] = Field(None, ge=1, le=500)
    carbs: Optional[int] = Field(None, ge=1, le=1000)
    period_weeks: Optional[int] = Field(None, ge=1, le=52)
    breakfast: Optional[str] = Field(None, min_length=1)
    lunch: Optional[str] = Field(None, min_length=1)
    dinner: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = Field(None, description="Описание плана питания")
    athlete_ids: Optional[List[int]] = None


class NutritionPlanResponse(NutritionPlanBase):
    id: int
    status: NutritionStatus
    athletes: List[AthleteSimpleResponse] = Field(description="Список спортсменов")

    class Config:
        from_attributes = True
