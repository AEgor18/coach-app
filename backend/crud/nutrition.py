from typing import List, Optional

from sqlalchemy.orm import Session

from models.athletes import Athlete
from models.nutrition import NutritionPlan, NutritionStatus
from schemas.nutrition import NutritionPlanCreate, NutritionPlanUpdate


def get_nutrition_plans(db: Session) -> List[NutritionPlan]:
    """Получить все планы питания"""
    return db.query(NutritionPlan).all()


def get_nutrition_plan(db: Session, plan_id: int) -> Optional[NutritionPlan]:
    """Получить план питания по ID"""
    return db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()


def create_nutrition_plan(db: Session, plan: NutritionPlanCreate) -> NutritionPlan:
    """Создать новый план питания"""
    athletes = db.query(Athlete).filter(Athlete.id.in_(plan.athlete_ids)).all()

    db_plan = NutritionPlan(
        title=plan.title,
        nutrition_type=plan.nutrition_type,
        calories=plan.calories,
        protein=plan.protein,
        fats=plan.fats,
        carbs=plan.carbs,
        period_weeks=plan.period_weeks,
        breakfast=plan.breakfast,
        lunch=plan.lunch,
        dinner=plan.dinner,
        description=plan.description,
        athletes=athletes,
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def update_nutrition_plan(
    db: Session, plan_id: int, plan_update: NutritionPlanUpdate
) -> Optional[NutritionPlan]:
    """Обновить план питания"""
    db_plan = db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()
    if not db_plan:
        return None

    update_data = plan_update.dict(exclude_unset=True)

    athlete_ids = update_data.pop("athlete_ids", None)
    if athlete_ids is not None:
        athletes = db.query(Athlete).filter(Athlete.id.in_(athlete_ids)).all()
        db_plan.athletes = athletes

    for field, value in update_data.items():
        if value is not None:
            setattr(db_plan, field, value)

    db.commit()
    db.refresh(db_plan)
    return db_plan


def update_nutrition_status(
    db: Session, plan_id: int, status: NutritionStatus
) -> Optional[NutritionPlan]:
    """Обновить статус плана питания"""
    db_plan = db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()
    if not db_plan:
        return None

    db_plan.status = status
    db.commit()
    db.refresh(db_plan)
    return db_plan


def delete_nutrition_plan(db: Session, plan_id: int) -> bool:
    """Удалить план питания"""
    db_plan = db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()
    if not db_plan:
        return False

    db.delete(db_plan)
    db.commit()
    return True
