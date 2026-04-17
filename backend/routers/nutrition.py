from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from crud.nutrition import (
    create_nutrition_plan,
    delete_nutrition_plan,
    get_nutrition_plan,
    get_nutrition_plans,
    update_nutrition_plan,
    update_nutrition_status,
)
from database import get_db
from dependencies.auth import get_current_coach
from models.nutrition import NutritionStatus
from models.profile import CoachProfile
from schemas.nutrition import (
    NutritionPlanCreate,
    NutritionPlanResponse,
    NutritionPlanUpdate,
)


router = APIRouter(prefix="/api/nutrition", tags=["Nutrition"])


@router.get("/plans", response_model=List[NutritionPlanResponse])
async def read_nutrition_plans(
    db: Session = Depends(get_db), coach: CoachProfile = Depends(get_current_coach)
):
    plans = get_nutrition_plans(db, coach_id=coach.id)
    return plans


@router.post(
    "/plans", response_model=NutritionPlanResponse, status_code=status.HTTP_201_CREATED
)
async def create_new_nutrition_plan(
    plan: NutritionPlanCreate,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    return create_nutrition_plan(db=db, plan=plan, coach_id=coach.id)


@router.get("/plans/{plan_id}", response_model=NutritionPlanResponse)
async def read_nutrition_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Получить план питания по ID"""
    db_plan = get_nutrition_plan(db, plan_id=plan_id)
    if db_plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Nutrition plan not found"
        )
    return db_plan


@router.put("/plans/{plan_id}", response_model=NutritionPlanResponse)
async def update_nutrition_plan_data(
    plan_id: int,
    plan_update: NutritionPlanUpdate,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Обновить данные плана питания"""
    db_plan = update_nutrition_plan(db, plan_id=plan_id, plan_update=plan_update)
    if db_plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Nutrition plan not found"
        )
    return db_plan


@router.patch("/plans/{plan_id}/status", response_model=NutritionPlanResponse)
async def update_nutrition_status_endpoint(
    plan_id: int,
    new_status: NutritionStatus,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Обновить статус плана питания"""
    db_plan = update_nutrition_status(db, plan_id=plan_id, status=new_status)
    if db_plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Nutrition plan not found"
        )
    return db_plan


@router.delete("/plans/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_nutrition_plan_endpoint(
    plan_id: int,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Удалить план питания"""
    success = delete_nutrition_plan(db, plan_id=plan_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Nutrition plan not found"
        )
    return None
