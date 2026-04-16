from datetime import date

from sqlalchemy.orm import Session

from crud.reports import create_report, get_reports
from schemas.reports import ReportCreate


class TestReportsCRUD:
    def test_create_report_success(self, db_session: Session, test_coach):
        report_data = ReportCreate(
            title="Отчёт за январь",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31),
            created_date=date(2024, 2, 1),
            attendance=95,
            trainings=20,
            skips=2,
            participants=10,
        )

        result = create_report(db_session, report_data, test_coach.id)

        assert result.id is not None
        assert result.title == "Отчёт за январь"
        assert result.coach_id == test_coach.id
        assert result.attendance == 95

    def test_report_filtered_by_coach(self, db_session: Session, test_coach):
        create_report(
            db_session,
            ReportCreate(
                title="Мой отчёт",
                start_date=date(2024, 1, 1),
                end_date=date(2024, 1, 31),
                created_date=date(2024, 2, 1),
                attendance=90,
                trainings=10,
                skips=1,
                participants=5,
            ),
            coach_id=test_coach.id,
        )

        create_report(
            db_session,
            ReportCreate(
                title="Чужой отчёт",
                start_date=date(2024, 1, 1),
                end_date=date(2024, 1, 31),
                created_date=date(2024, 2, 1),
                attendance=80,
                trainings=8,
                skips=2,
                participants=3,
            ),
            coach_id=999,
        )

        reports = get_reports(db_session, coach_id=test_coach.id)

        assert len(reports) == 1
        assert reports[0].title == "Мой отчёт"
