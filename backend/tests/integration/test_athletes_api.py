from fastapi import status

from models.athletes import SportType


class TestAthletesEndpoints:
    def test_get_athletes_unauthorized(self, client):
        response = client.get("/api/athletes/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Token missing" in response.json()["detail"]

    def test_get_athletes_authorized_empty(self, authorized_client):
        response = authorized_client.get("/api/athletes/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "data" in data
        assert "total" in data
        assert data["data"] == []
        assert data["total"] == 0

    def test_create_athlete_success(self, authorized_client):
        payload = {
            "name": "Новый Спортсмен",
            "sport_type": "Бег",
            "age": 28,
            "phone": "+7 (999) 000-11-22",
            "progress": 45,
        }
        response = authorized_client.post("/api/athletes/", json=payload)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == "Новый Спортсмен"
        assert data["sport_type"] == "Бег"
        assert data["status"] == "Активен"
        assert "id" in data

    def test_create_athlete_validation_error(self, authorized_client):
        payload = {
            "name": "",
            "sport_type": "Йога",
            "age": 25,
            "phone": "12345",
            "progress": 0,
        }
        response = authorized_client.post("/api/athletes/", json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        assert "detail" in response.json()

    def test_get_athlete_not_found(self, authorized_client):
        response = authorized_client.get("/api/athletes/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_athlete_success(self, authorized_client, db_session, test_coach):
        from crud.athletes import create_athlete
        from schemas.athletes import AthleteCreate

        athlete = create_athlete(
            db_session,
            AthleteCreate(
                name="Исходный",
                sport_type=SportType.SWIMMING,
                age=20,
                phone="+79990003001",
                progress=10,
            ),
            coach_id=test_coach.id,
        )

        response = authorized_client.put(
            f"/api/athletes/{athlete.id}", json={"name": "Обновлённый", "progress": 90}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["name"] == "Обновлённый"
        assert response.json()["progress"] == 90

    def test_delete_athlete_success(self, authorized_client, db_session, test_coach):
        from crud.athletes import create_athlete
        from schemas.athletes import AthleteCreate

        athlete = create_athlete(
            db_session,
            AthleteCreate(
                name="На удаление",
                sport_type=SportType.YOGA,
                age=22,
                phone="+79990003002",
                progress=0,
            ),
            coach_id=test_coach.id,
        )

        response = authorized_client.delete(f"/api/athletes/{athlete.id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT

        verify = authorized_client.get(f"/api/athletes/{athlete.id}")
        assert verify.status_code == status.HTTP_404_NOT_FOUND

    def test_athlete_isolation_by_coach(self, authorized_client, db_session):
        from crud.athletes import create_athlete
        from schemas.athletes import AthleteCreate

        # Создаём спортсмена у ДРУГОГО тренера
        create_athlete(
            db_session,
            AthleteCreate(
                name="Чужой",
                sport_type=SportType.RUNNING,
                age=25,
                phone="+79990003003",
                progress=0,
            ),
            coach_id=999,
        )

        response = authorized_client.get("/api/athletes/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        # Не должен видеть чужих спортсменов
        assert not any(a["name"] == "Чужой" for a in data["data"])


class TestAthletesPaginationFiltering:
    def test_pagination_params(self, authorized_client, db_session, test_coach):
        from crud.athletes import create_athlete
        from schemas.athletes import AthleteCreate

        for i in range(15):
            create_athlete(
                db_session,
                AthleteCreate(
                    name=f"Спортсмен {i}",
                    sport_type=SportType.RUNNING,
                    age=20 + i,
                    phone=f"+79990004{i:03d}",
                    progress=i * 5,
                ),
                coach_id=test_coach.id,
            )

        response = authorized_client.get("/api/athletes/?page=2&limit=5")
        data = response.json()
        assert data["page"] == 2
        assert data["limit"] == 5
        assert len(data["data"]) == 5
        assert data["total"] == 15
        assert data["pages"] == 3

    def test_filter_by_age_range(self, authorized_client, db_session, test_coach):
        from crud.athletes import create_athlete
        from schemas.athletes import AthleteCreate

        for age in [18, 22, 25, 30, 35]:
            create_athlete(
                db_session,
                AthleteCreate(
                    name=f"Age{age}",
                    sport_type=SportType.YOGA,
                    age=age,
                    phone=f"+79990005{age:03d}",
                    progress=0,
                ),
                coach_id=test_coach.id,
            )

        response = authorized_client.get("/api/athletes/?min_age=22&max_age=30")
        data = response.json()
        assert data["total"] == 3
        assert all(22 <= a["age"] <= 30 for a in data["data"])

    def test_search_filter(self, authorized_client, db_session, test_coach):
        from crud.athletes import create_athlete
        from schemas.athletes import AthleteCreate

        for name in ["Александр", "Алексей", "Мария"]:
            create_athlete(
                db_session,
                AthleteCreate(
                    name=name,
                    sport_type=SportType.RUNNING,
                    age=25,
                    phone=f"+79990006{hash(name) % 1000:03d}",
                    progress=0,
                ),
                coach_id=test_coach.id,
            )

        response = authorized_client.get("/api/athletes/?search=Алекс")
        data = response.json()
        assert data["total"] == 2
        assert all("Алекс" in a["name"] for a in data["data"])

    def test_sorting(self, authorized_client, db_session, test_coach):
        from crud.athletes import create_athlete
        from schemas.athletes import AthleteCreate

        for name, age in [("Zoe", 20), ("Alex", 30), ("Mike", 25)]:
            create_athlete(
                db_session,
                AthleteCreate(
                    name=name,
                    sport_type=SportType.RUNNING,
                    age=age,
                    phone=f"+79990007{hash(name) % 1000:03d}",
                    progress=0,
                ),
                coach_id=test_coach.id,
            )

        response = authorized_client.get("/api/athletes/?sort_by=name&sort_order=desc")
        names = [a["name"] for a in response.json()["data"]]
        assert names == sorted(["Zoe", "Alex", "Mike"], reverse=True)
