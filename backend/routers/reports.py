from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from crud.reports import (
    create_report,
    delete_report,
    get_report,
    get_reports,
    update_report,
)
from database import get_db
from dependencies.auth import get_current_coach
from models.profile import CoachProfile
from schemas.reports import ReportCreate, ReportResponse, ReportUpdate

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/", response_model=List[ReportResponse])
async def read_reports(
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach)
):
    """Получить все отчеты"""
    reports = get_reports(db)
    return reports


@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_new_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach)
):
    """Создать новый отчет"""
    return create_report(db=db, report=report)


@router.get("/{report_id}", response_model=ReportResponse)
async def read_report(
    report_id: int,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach)
):
    """Получить отчет по ID"""
    db_report = get_report(db, report_id=report_id)
    if db_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
        )
    return db_report


@router.put("/{report_id}", response_model=ReportResponse)
async def update_report_data(
    report_id: int,
    report_update: ReportUpdate,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach)
):
    """Обновить данные отчета"""
    db_report = update_report(db, report_id=report_id, report_update=report_update)
    if db_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
        )
    return db_report


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report_endpoint(
    report_id: int,
    db: Session = Depends(get_db),
    coach: CoachProfile = Depends(get_current_coach)
):
    """Удалить отчет"""
    success = delete_report(db, report_id=report_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
        )
    return None