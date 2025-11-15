from typing import List, Optional

from sqlalchemy.orm import Session

from models.reports import Report
from schemas.reports import ReportCreate, ReportUpdate


def get_reports(db: Session) -> List[Report]:
    """Получить все отчеты"""
    return db.query(Report).all()


def get_report(db: Session, report_id: int) -> Optional[Report]:
    """Получить отчет по ID"""
    return db.query(Report).filter(Report.id == report_id).first()


def create_report(db: Session, report: ReportCreate) -> Report:
    """Создать новый отчет"""
    db_report = Report(
        title=report.title,
        start_date=report.start_date,
        end_date=report.end_date,
        created_date=report.created_date,
        attendance=report.attendance,
        trainings=report.trainings,
        skips=report.skips,
        participants=report.participants,
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


def update_report(
    db: Session, report_id: int, report_update: ReportUpdate
) -> Optional[Report]:
    """Обновить отчет"""
    db_report = db.query(Report).filter(Report.id == report_id).first()
    if not db_report:
        return None

    update_data = report_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_report, field, value)

    db.commit()
    db.refresh(db_report)
    return db_report


def delete_report(db: Session, report_id: int) -> bool:
    """Удалить отчет"""
    db_report = db.query(Report).filter(Report.id == report_id).first()
    if not db_report:
        return False

    db.delete(db_report)
    db.commit()
    return True
