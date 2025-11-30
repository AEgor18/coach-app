from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from crud.trainings import (
    create_training_plan,
    delete_training_plan,
    get_training_plan,
    get_training_plans,
    update_training_plan,
    update_training_status,
)
from database import get_db
from dependencies.auth import get_current_coach
from models.profile import CoachProfile
from models.trainings import TrainingStatus
from schemas.trainings import (
    TrainingPlanCreate,
    TrainingPlanResponse,
    TrainingPlanUpdate,
)

router = APIRouter(prefix="/api/trainings", tags=["Trainings"])


@router.get("/plans", response_model=List[TrainingPlanResponse])
async def read_training_plans(
    db: Session = Depends(get_db), coach: CoachProfile = Depends(get_current_coach)
):
    """Получить все планы тренировок"""
    plans = get_training_plans(db)
    return plans


@router.post(
    "/plans", response_model=TrainingPlanResponse, status_code=status.HTTP_201_CREATED
)
async def create_new_training_plan(
    plan: TrainingPlanCreate,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Создать новый план тренировки"""
    return create_training_plan(db=db, plan=plan)


@router.get("/plans/{plan_id}", response_model=TrainingPlanResponse)
async def read_training_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Получить план тренировки по ID"""
    db_plan = get_training_plan(db, plan_id=plan_id)
    if db_plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Training plan not found"
        )
    return db_plan


@router.put("/plans/{plan_id}", response_model=TrainingPlanResponse)
async def update_training_plan_data(
    plan_id: int,
    plan_update: TrainingPlanUpdate,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Обновить данные плана тренировки"""
    db_plan = update_training_plan(db, plan_id=plan_id, plan_update=plan_update)
    if db_plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Training plan not found"
        )
    return db_plan


@router.patch("/plans/{plan_id}/status", response_model=TrainingPlanResponse)
async def update_training_status_endpoint(
    plan_id: int,
    new_status: TrainingStatus,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Обновить статус тренировки"""
    db_plan = update_training_status(db, plan_id=plan_id, status=new_status)
    if db_plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Training plan not found"
        )
    return db_plan


@router.delete("/plans/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_training_plan_endpoint(
    plan_id: int,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Удалить план тренировки"""
    success = delete_training_plan(db, plan_id=plan_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Training plan not found"
        )
    return None
