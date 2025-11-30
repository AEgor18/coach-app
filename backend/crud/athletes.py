from typing import List, Optional

from sqlalchemy.orm import Session

from models.athletes import Athlete, AthleteStatus
from schemas.athletes import AthleteCreate, AthleteUpdate


def get_athletes(db: Session) -> List[Athlete]:
    return db.query(Athlete).all()


def get_athlete(db: Session, athlete_id: int) -> Optional[Athlete]:
    return db.query(Athlete).filter(Athlete.id == athlete_id).first()


def create_athlete(db: Session, athlete: AthleteCreate) -> Athlete:
    db_athlete = Athlete(
        name=athlete.name,
        sport_type=athlete.sport_type,
        age=athlete.age,
        phone=athlete.phone,
        progress=athlete.progress,
    )
    db.add(db_athlete)
    db.commit()
    db.refresh(db_athlete)
    return db_athlete


def update_athlete(
    db: Session, athlete_id: int, athlete_update: AthleteUpdate
) -> Optional[Athlete]:
    db_athlete = db.query(Athlete).filter(Athlete.id == athlete_id).first()
    if not db_athlete:
        return None

    update_data = athlete_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_athlete, field, value)

    db.commit()
    db.refresh(db_athlete)
    return db_athlete


def update_athlete_status(
    db: Session, athlete_id: int, status: AthleteStatus
) -> Optional[Athlete]:
    """Обновить только статус атлета"""
    db_athlete = db.query(Athlete).filter(Athlete.id == athlete_id).first()
    if not db_athlete:
        return None

    db_athlete.status = status
    db.commit()
    db.refresh(db_athlete)
    return db_athlete


def delete_athlete(db: Session, athlete_id: int) -> bool:
    db_athlete = db.query(Athlete).filter(Athlete.id == athlete_id).first()
    if not db_athlete:
        return False

    db.delete(db_athlete)
    db.commit()
    return True
