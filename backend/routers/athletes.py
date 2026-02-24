from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from crud.athletes import (
    create_athlete,
    delete_athlete,
    get_athlete,
    get_athletes,
    update_athlete,
    update_athlete_status,
)
from database import get_db
from dependencies.auth import get_current_coach
from models.athletes import AthleteStatus
from models.profile import CoachProfile
from schemas.athletes import (
    AthleteCreate,
    AthleteResponse,
    AthleteStatusUpdate,
    AthleteUpdate,
)

router = APIRouter(prefix="/api/athletes", tags=["Athletes"])


@router.get("/", response_model=List[AthleteResponse])
async def read_athletes(
    db: Session = Depends(get_db), coach: CoachProfile = Depends(get_current_coach)
):
    """Получить список спортсменов текущего тренера"""
    athletes = get_athletes(db, coach_id=coach.id)
    return athletes


@router.post("/", response_model=AthleteResponse, status_code=status.HTTP_201_CREATED)
async def create_new_athlete(
    athlete: AthleteCreate,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Создать нового спортсмена для текущего тренера"""
    return create_athlete(db=db, athlete=athlete, coach_id=coach.id)


@router.get("/{athlete_id}", response_model=AthleteResponse)
async def read_athlete(
    athlete_id: int,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Получить спортсмена по ID"""
    db_athlete = get_athlete(db, athlete_id=athlete_id)
    if db_athlete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Athlete not found"
        )
    return db_athlete


@router.put("/{athlete_id}", response_model=AthleteResponse)
async def update_athlete_data(
    athlete_id: int,
    athlete_update: AthleteUpdate,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Обновить данные спортсмена"""
    db_athlete = update_athlete(
        db, athlete_id=athlete_id, athlete_update=athlete_update
    )
    if db_athlete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Athlete not found"
        )
    return db_athlete


@router.patch("/{athlete_id}/status", response_model=AthleteResponse)
async def update_athlete_status_endpoint(
    athlete_id: int,
    status_update: AthleteStatusUpdate,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Обновить статус атлета"""
    db_athlete = update_athlete_status(
        db, athlete_id=athlete_id, status=status_update.status
    )
    if db_athlete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Athlete not found"
        )
    return db_athlete


@router.delete("/{athlete_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_athlete_endpoint(
    athlete_id: int,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Удалить спортсмена"""
    success = delete_athlete(db, athlete_id=athlete_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Athlete not found"
        )
    return None
