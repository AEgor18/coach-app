from fastapi import status

from crud.athletes import create_athlete
from models.athletes import SportType
from schemas.athletes import AthleteCreate


class TestNutritionEndpoints:
    def test_get_nutrition_plans_unauthorized(self, client):
        response = client.get("/api/nutrition/plans")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_nutrition_plans_authorized_empty(self, authorized_client):
        response = authorized_client.get("/api/nutrition/plans")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_create_nutrition_plan_success(self, authorized_client, db_session, test_coach):
        athlete = create_athlete(
            db_session,
            AthleteCreate(
                name="Для питания",
                sport_type=SportType.RUNNING,
                age=25,
                phone="+79990008001",
                progress=0,
            ),
            coach_id=test_coach.id,
        )

        payload = {
            "title": "План набора",
            "nutrition_type": "набор массы",
            "calories": 2500,
            "protein": 150,
            "fats": 70,
            "carbs": 300,
            "period_weeks": 8,
            "breakfast": "Овсянка",
            "lunch": "Курица",
            "dinner": "Рыба",
            "athlete_ids": [athlete.id],
        }
        response = authorized_client.post("/api/nutrition/plans", json=payload)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == "План набора"
        assert data["calories"] == 2500
        assert len(data["athletes"]) == 1

    def test_create_nutrition_plan_validation_error(self, authorized_client):
        payload = {
            "title": "",
            "nutrition_type": "набор массы",
            "calories": 2500,
            "protein": 150,
            "fats": 70,
            "carbs": 300,
            "period_weeks": 8,
            "breakfast": "Завтрак",
            "lunch": "Обед",
            "dinner": "Ужин",
        }
        response = authorized_client.post("/api/nutrition/plans", json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_get_nutrition_plan_not_found(self, authorized_client):
        response = authorized_client.get("/api/nutrition/plans/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_nutrition_plan_success(self, authorized_client, db_session, test_coach):
        from crud.nutrition import create_nutrition_plan
        from schemas.nutrition import NutritionPlanCreate

        athlete = create_athlete(
            db_session,
            AthleteCreate(
                name="Тест", sport_type=SportType.YOGA, age=20, phone="+79990008002", progress=0
            ),
            coach_id=test_coach.id,
        )
        plan = create_nutrition_plan(
            db_session,
            NutritionPlanCreate(
                title="Исходный",
                nutrition_type="поддержание",
                calories=2000,
                protein=100,
                fats=60,
                carbs=250,
                period_weeks=4,
                breakfast="Завтрак",
                lunch="Обед",
                dinner="Ужин",
                athlete_ids=[athlete.id],
            ),
            coach_id=test_coach.id,
        )

        response = authorized_client.put(
            f"/api/nutrition/plans/{plan.id}", json={"title": "Обновлённый", "calories": 2200}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["title"] == "Обновлённый"
        assert response.json()["calories"] == 2200

    def test_update_nutrition_status_success(self, authorized_client, db_session, test_coach):
        from crud.nutrition import create_nutrition_plan
        from schemas.nutrition import NutritionPlanCreate

        athlete = create_athlete(
            db_session,
            AthleteCreate(
                name="Тест", sport_type=SportType.RUNNING, age=25, phone="+79990008003", progress=0
            ),
            coach_id=test_coach.id,
        )
        plan = create_nutrition_plan(
            db_session,
            NutritionPlanCreate(
                title="Статус тест",
                nutrition_type="поддержание",
                calories=2000,
                protein=100,
                fats=60,
                carbs=250,
                period_weeks=4,
                breakfast="Завтрак",
                lunch="Обед",
                dinner="Ужин",
                athlete_ids=[athlete.id],
            ),
            coach_id=test_coach.id,
        )

        response = authorized_client.patch(
            f"/api/nutrition/plans/{plan.id}/status?new_status=Завершен"
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "Завершен"

    def test_delete_nutrition_plan_success(self, authorized_client, db_session, test_coach):
        from crud.nutrition import create_nutrition_plan
        from schemas.nutrition import NutritionPlanCreate

        plan = create_nutrition_plan(
            db_session,
            NutritionPlanCreate(
                title="На удаление",
                nutrition_type="поддержание",
                calories=2000,
                protein=100,
                fats=60,
                carbs=250,
                period_weeks=4,
                breakfast="Завтрак",
                lunch="Обед",
                dinner="Ужин",
                athlete_ids=[],
            ),
            coach_id=test_coach.id,
        )

        response = authorized_client.delete(f"/api/nutrition/plans/{plan.id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT

        verify = authorized_client.get(f"/api/nutrition/plans/{plan.id}")
        assert verify.status_code == status.HTTP_404_NOT_FOUND

    def test_nutrition_plan_isolation_by_coach(self, authorized_client, db_session):
        from crud.nutrition import create_nutrition_plan
        from schemas.nutrition import NutritionPlanCreate

        create_nutrition_plan(
            db_session,
            NutritionPlanCreate(
                title="Чужой план",
                nutrition_type="поддержание",
                calories=2000,
                protein=100,
                fats=60,
                carbs=250,
                period_weeks=4,
                breakfast="Завтрак",
                lunch="Обед",
                dinner="Ужин",
                athlete_ids=[],
            ),
            coach_id=999,
        )

        response = authorized_client.get("/api/nutrition/plans")
        assert response.status_code == status.HTTP_200_OK
        assert not any(p["title"] == "Чужой план" for p in response.json())
