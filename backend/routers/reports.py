from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from crud.reports import create_report, delete_report, get_report, get_reports, update_report
from database import get_db
from dependencies.auth import get_current_coach
from models.profile import CoachProfile
from schemas.reports import ReportCreate, ReportResponse, ReportUpdate

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/", response_model=List[ReportResponse])
async def read_reports(
    db: Session = Depends(get_db), coach: CoachProfile = Depends(get_current_coach)
):
    """Получить все отчеты"""
    return get_reports(db, coach_id=coach.id)


@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_new_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Создать новый отчет"""
    return create_report(db, report=report, coach_id=coach.id)


@router.get("/{report_id}", response_model=ReportResponse)
async def read_report(
    report_id: int,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Получить отчет по ID"""
    db_report = get_report(db, report_id=report_id)
    if not db_report or db_report.coach_id != coach.id:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report


@router.put("/{report_id}", response_model=ReportResponse)
async def update_report_data(
    report_id: int,
    report_update: ReportUpdate,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Обновить данные отчета"""
    db_report = update_report(db, report_id=report_id, report_update=report_update)
    if not db_report or db_report.coach_id != coach.id:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report_endpoint(
    report_id: int,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach),
):
    """Удалить отчет"""
    db_report = get_report(db, report_id=report_id)
    if not db_report or db_report.coach_id != coach.id:
        raise HTTPException(status_code=404, detail="Report not found")
    delete_report(db, report_id=report_id)
    return None
