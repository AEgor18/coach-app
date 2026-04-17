from typing import List, Optional

from sqlalchemy.orm import Session

from models.athletes import Athlete
from models.trainings import TrainingPlan, TrainingStatus
from schemas.trainings import TrainingPlanCreate, TrainingPlanUpdate


def get_training_plans(db: Session, coach_id: int) -> List[TrainingPlan]:
    """Получить все планы тренировок"""
    return db.query(TrainingPlan).filter(TrainingPlan.coach_id == coach_id).all()


def get_training_plan(db: Session, plan_id: int) -> Optional[TrainingPlan]:
    """Получить план тренировки по ID"""
    return db.query(TrainingPlan).filter(TrainingPlan.id == plan_id).first()


def create_training_plan(
    db: Session, plan: TrainingPlanCreate, coach_id: int
) -> TrainingPlan:
    """Создать новый план тренировки"""
    athletes = db.query(Athlete).filter(Athlete.id.in_(plan.athlete_ids)).all()
    db_plan = TrainingPlan(
        date=plan.date,
        title=plan.title,
        training_type=plan.training_type,
        duration=plan.duration,
        skill_level=plan.skill_level,
        description=plan.description or "",
        athletes=athletes,
        coach_id=coach_id,
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def update_training_plan(
    db: Session, plan_id: int, plan_update: TrainingPlanUpdate
) -> Optional[TrainingPlan]:
    """Обновить план тренировки"""
    db_plan = db.query(TrainingPlan).filter(TrainingPlan.id == plan_id).first()
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


def delete_training_plan(db: Session, plan_id: int) -> bool:
    """Удалить план тренировки"""
    db_plan = db.query(TrainingPlan).filter(TrainingPlan.id == plan_id).first()
    if not db_plan:
        return False

    db.delete(db_plan)
    db.commit()
    return True


def update_training_status(
    db: Session, plan_id: int, status: TrainingStatus
) -> Optional[TrainingPlan]:
    """Обновить статус тренировки"""
    db_plan = db.query(TrainingPlan).filter(TrainingPlan.id == plan_id).first()
    if not db_plan:
        return None

    db_plan.status = status
    db.commit()
    db.refresh(db_plan)
    return db_plan
