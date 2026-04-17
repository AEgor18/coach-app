from datetime import datetime

from fastapi import status


class TestAuthEndpoints:
    def test_login_success(self, client, db_session, test_coach):
        response = client.post(
            "/api/profile/login",
            json={"email": "test@coach.com", "password": "secure123"},
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client):
        response = client.post(
            "/api/profile/login",
            json={"email": "test@coach.com", "password": "wrongpass"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_nonexistent_email(self, client):
        response = client.post(
            "/api/profile/login", json={"email": "not-an-email", "password": "anypass"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

        response = client.post(
            "/api/profile/login",
            json={"email": "nobody@test.com", "password": "anypass"},
        )
        assert response.status_code in [
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_422_UNPROCESSABLE_ENTITY,
        ]

    def test_refresh_token_invalid(self, client):
        response = client.post(
            "/api/profile/refresh", json={"refresh_token": "invalid_token_xyz"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestAuthMiddleware:
    def test_public_endpoints_no_auth(self, client):
        public_paths = ["/health", "/", "/docs", "/openapi.json", "/api/info"]
        for path in public_paths:
            response = client.get(path)
            assert response.status_code != status.HTTP_401_UNAUTHORIZED

    def test_protected_endpoint_no_token(self, client):
        response = client.get("/api/athletes/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Token missing" in response.json()["detail"]

    def test_protected_endpoint_invalid_token(self, client):
        response = client.get(
            "/api/athletes/", headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid token" in response.json()["detail"]

    def test_token_expiration(self, client):
        # Создаём просроченный токен
        from jose import jwt

        from core.config import settings

        payload = {
            "sub": "test@coach.com",
            "exp": int(datetime.now().timestamp()) - 100,
        }
        expired = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

        response = client.get(
            "/api/athletes/", headers={"Authorization": f"Bearer {expired}"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
