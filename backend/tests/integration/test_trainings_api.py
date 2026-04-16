from datetime import date, timedelta

from fastapi import status

from crud.athletes import create_athlete
from models.athletes import SportType
from schemas.athletes import AthleteCreate


class TestTrainingsEndpoints:
    def test_get_training_plans_unauthorized(self, client):
        response = client.get("/api/trainings/plans")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_training_plans_authorized_empty(self, authorized_client):
        response = authorized_client.get("/api/trainings/plans")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_create_training_plan_success(self, authorized_client, db_session, test_coach):
        athlete = create_athlete(
            db_session,
            AthleteCreate(
                name="Для тренировки",
                sport_type=SportType.RUNNING,
                age=25,
                phone="+79990009001",
                progress=0,
            ),
            coach_id=test_coach.id,
        )

        payload = {
            "date": (date.today() + timedelta(days=1)).isoformat(),
            "title": "Утренняя пробежка",
            "training_type": "Кардио",
            "duration": 45,
            "skill_level": "Средний",
            "description": "Лёгкий бег",
            "athlete_ids": [athlete.id],
        }
        response = authorized_client.post("/api/trainings/plans", json=payload)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == "Утренняя пробежка"
        assert data["duration"] == 45
        assert len(data["athletes"]) == 1

    def test_create_training_plan_validation_error(self, authorized_client):
        payload = {
            "date": "invalid",
            "title": "",
            "training_type": "Кардио",
            "duration": 45,
            "skill_level": "Средний",
        }
        response = authorized_client.post("/api/trainings/plans", json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_get_training_plan_not_found(self, authorized_client):
        response = authorized_client.get("/api/trainings/plans/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_training_plan_success(self, authorized_client, db_session, test_coach):
        from crud.trainings import create_training_plan
        from schemas.trainings import TrainingPlanCreate

        athlete = create_athlete(
            db_session,
            AthleteCreate(
                name="Тест", sport_type=SportType.YOGA, age=20, phone="+79990009002", progress=0
            ),
            coach_id=test_coach.id,
        )
        plan = create_training_plan(
            db_session,
            TrainingPlanCreate(
                date=date.today(),
                title="Исходный",
                training_type="Силовые",
                duration=30,
                skill_level="Начальный",
                description="",
                athlete_ids=[athlete.id],
            ),
            coach_id=test_coach.id,
        )

        response = authorized_client.put(
            f"/api/trainings/plans/{plan.id}", json={"title": "Обновлённый", "duration": 60}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["title"] == "Обновлённый"
        assert response.json()["duration"] == 60

    def test_update_training_status_success(self, authorized_client, db_session, test_coach):
        from crud.trainings import create_training_plan
        from schemas.trainings import TrainingPlanCreate

        athlete = create_athlete(
            db_session,
            AthleteCreate(
                name="Тест", sport_type=SportType.RUNNING, age=25, phone="+79990009003", progress=0
            ),
            coach_id=test_coach.id,
        )
        plan = create_training_plan(
            db_session,
            TrainingPlanCreate(
                date=date.today(),
                title="Статус тест",
                training_type="Кардио",
                duration=45,
                skill_level="Средний",
                description="",
                athlete_ids=[athlete.id],
            ),
            coach_id=test_coach.id,
        )

        response = authorized_client.patch(
            f"/api/trainings/plans/{plan.id}/status?new_status=Завершенная"
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "Завершенная"

    def test_delete_training_plan_success(self, authorized_client, db_session, test_coach):
        from crud.trainings import create_training_plan
        from schemas.trainings import TrainingPlanCreate

        plan = create_training_plan(
            db_session,
            TrainingPlanCreate(
                date=date.today(),
                title="На удаление",
                training_type="Кардио",
                duration=45,
                skill_level="Средний",
                description="",
                athlete_ids=[],
            ),
            coach_id=test_coach.id,
        )

        response = authorized_client.delete(f"/api/trainings/plans/{plan.id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT

        verify = authorized_client.get(f"/api/trainings/plans/{plan.id}")
        assert verify.status_code == status.HTTP_404_NOT_FOUND

    def test_training_plan_isolation_by_coach(self, authorized_client, db_session):
        from crud.trainings import create_training_plan
        from schemas.trainings import TrainingPlanCreate

        create_training_plan(
            db_session,
            TrainingPlanCreate(
                date=date.today(),
                title="Чужой план",
                training_type="Кардио",
                duration=45,
                skill_level="Средний",
                description="",
                athlete_ids=[],
            ),
            coach_id=999,
        )

        response = authorized_client.get("/api/trainings/plans")
        assert response.status_code == status.HTTP_200_OK
        assert not any(p["title"] == "Чужой план" for p in response.json())
