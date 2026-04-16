from fastapi import status


class TestProfileEndpoints:
    def test_register_success(self, client, db_session):
        from models.profile import CoachProfile

        db_session.query(CoachProfile).delete()
        db_session.commit()

        payload = {
            "full_name": "Новый Тренер",
            "phone": "+79990010001",
            "email": "new@test.com",
            "password": "SecurePass123!",
        }
        response = client.post("/api/profile/register", json=payload)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == "new@test.com"
        assert data["full_name"] == "Новый Тренер"

    def test_register_duplicate_email(self, client, test_coach):
        payload = {
            "full_name": "Дубликат",
            "phone": "+79990010002",
            "email": "test@coach.com",
            "password": "SecurePass123!",
        }
        response = client.post("/api/profile/register", json=payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Email already registered" in response.json()["detail"]

    def test_login_success(self, client, test_coach):
        payload = {"email": "test@coach.com", "password": "secure123"}
        response = client.post("/api/profile/login", json=payload)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client):
        payload = {"email": "test@coach.com", "password": "wrongpass"}
        response = client.post("/api/profile/login", json=payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_me_success(self, authorized_client, test_coach):
        response = authorized_client.get("/api/profile/me")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == test_coach.email
        assert data["full_name"] == test_coach.full_name

    def test_update_profile_success(self, authorized_client, test_coach):
        payload = {"full_name": "Обновлённое ФИО", "phone": "+79990010003"}
        response = authorized_client.put("/api/profile/", json=payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["full_name"] == "Обновлённое ФИО"

    def test_refresh_token_invalid(self, client):
        response = client.post("/api/profile/refresh", json={"refresh_token": "invalid_token"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_upload_avatar_wrong_type(self, authorized_client):
        response = authorized_client.post(
            "/api/profile/avatar", files={"file": ("test.txt", b"fake data", "text/plain")}
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Only JPEG or PNG" in response.json()["detail"]

    def test_upload_avatar_too_large(self, authorized_client):
        large_data = b"x" * (3 * 1024 * 1024)
        response = authorized_client.post(
            "/api/profile/avatar", files={"file": ("large.jpg", large_data, "image/jpeg")}
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "File too large" in response.json()["detail"]

    def test_delete_profile_success(self, authorized_client, db_session):
        response = authorized_client.delete("/api/profile/")
        assert response.status_code == status.HTTP_204_NO_CONTENT

        from models.profile import CoachProfile

        assert db_session.query(CoachProfile).filter_by(email="test@coach.com").first() is None
