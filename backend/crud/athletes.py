from typing import List, Optional, Tuple

from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from models.athletes import Athlete, AthleteStatus, SportType
from schemas.athletes import AthleteCreate, AthleteUpdate


def get_athletes(
    db: Session,
    coach_id: int,
    search: Optional[str] = None,
    sport_type: Optional[SportType] = None,
    status: Optional[AthleteStatus] = None,
    min_age: Optional[int] = None,
    max_age: Optional[int] = None,
    sort_by: str = "id",
    sort_order: str = "asc",
    page: int = 1,
    limit: int = 10,
) -> Tuple[List[Athlete], int]:

    query = db.query(Athlete).filter(Athlete.coach_id == coach_id)

    if search:
        query = query.filter(Athlete.name.ilike(f"%{search}%"))
    if sport_type:
        query = query.filter(Athlete.sport_type == sport_type)
    if status:
        query = query.filter(Athlete.status == status)
    if min_age:
        query = query.filter(Athlete.age >= min_age)
    if max_age:
        query = query.filter(Athlete.age <= max_age)

    total = query.count()

    allowed_sort_fields = {
        "id": Athlete.id,
        "name": Athlete.name,
        "age": Athlete.age,
        "progress": Athlete.progress,
    }
    sort_column = allowed_sort_fields.get(sort_by, Athlete.id)
    if sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))

    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    return query.all(), total


def get_athlete(db: Session, athlete_id: int) -> Optional[Athlete]:
    return db.query(Athlete).filter(Athlete.id == athlete_id).first()


def create_athlete(db: Session, athlete: AthleteCreate, coach_id: int) -> Athlete:
    db_athlete = Athlete(
        name=athlete.name,
        sport_type=athlete.sport_type,
        age=athlete.age,
        phone=athlete.phone,
        progress=athlete.progress,
        coach_id=coach_id,
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
