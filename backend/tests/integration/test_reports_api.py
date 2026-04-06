import pytest
from fastapi import status
from datetime import date


class TestReportsEndpoints:
    
    def test_get_reports_unauthorized(self, client):
        response = client.get("/api/reports/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_reports_authorized_empty(self, authorized_client):
        response = authorized_client.get("/api/reports/")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_create_report_success(self, authorized_client):
        payload = {
            "title": "Отчёт за месяц",
            "start_date": "2024-01-01",
            "end_date": "2024-01-31",
            "created_date": "2024-02-01",
            "attendance": 95,
            "trainings": 20,
            "skips": 2,
            "participants": 10
        }
        response = authorized_client.post("/api/reports/", json=payload)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == "Отчёт за месяц"
        assert data["attendance"] == 95

    def test_create_report_validation_error(self, authorized_client):
        payload = {"title": "", "start_date": "2024-01-31", "end_date": "2024-01-01",
                   "created_date": "2024-02-01", "attendance": 95, "trainings": 20,
                   "skips": 2, "participants": 10}
        response = authorized_client.post("/api/reports/", json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_get_report_not_found(self, authorized_client):
        response = authorized_client.get("/api/reports/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_report_success(self, authorized_client, db_session, test_coach):
        from crud.reports import create_report
        from schemas.reports import ReportCreate
        report = create_report(db_session, ReportCreate(
            title="Исходный", start_date=date(2024,1,1), end_date=date(2024,1,31),
            created_date=date(2024,2,1), attendance=90, trainings=15, skips=1, participants=8
        ), coach_id=test_coach.id)
        
        response = authorized_client.put(
            f"/api/reports/{report.id}",
            json={"title": "Обновлённый", "attendance": 98}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["title"] == "Обновлённый"
        assert response.json()["attendance"] == 98

    def test_delete_report_success(self, authorized_client, db_session, test_coach):
        from crud.reports import create_report
        from schemas.reports import ReportCreate
        report = create_report(db_session, ReportCreate(
            title="На удаление", start_date=date(2024,1,1), end_date=date(2024,1,31),
            created_date=date(2024,2,1), attendance=90, trainings=15, skips=1, participants=8
        ), coach_id=test_coach.id)
        
        response = authorized_client.delete(f"/api/reports/{report.id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        verify = authorized_client.get(f"/api/reports/{report.id}")
        assert verify.status_code == status.HTTP_404_NOT_FOUND

    def test_report_isolation_by_coach(self, authorized_client, db_session):
        from crud.reports import create_report
        from schemas.reports import ReportCreate
        create_report(db_session, ReportCreate(
            title="Чужой отчёт", start_date=date(2024,1,1), end_date=date(2024,1,31),
            created_date=date(2024,2,1), attendance=80, trainings=10, skips=2, participants=5
        ), coach_id=999)
        
        response = authorized_client.get("/api/reports/")
        assert response.status_code == status.HTTP_200_OK
        assert not any(r["title"] == "Чужой отчёт" for r in response.json())