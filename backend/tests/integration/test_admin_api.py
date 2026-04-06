import pytest
from fastapi import status
from models.roles import UserRole


class TestAdminEndpoints:
    
    def test_get_coaches_unauthorized(self, client):
        response = client.get("/api/admin/coaches")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_coaches_regular_user_forbidden(self, authorized_client):
        response = authorized_client.get("/api/admin/coaches")
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "Admin access required" in response.json()["detail"]

    def test_get_coaches_admin_success(self, admin_client, db_session, test_coach):
        response = admin_client.get("/api/admin/coaches")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert any(c["email"] == test_coach.email for c in data)

    def test_promote_user_unauthorized(self, client):
        response = client.patch("/api/admin/promote/1")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_promote_user_regular_forbidden(self, authorized_client):
        response = authorized_client.patch("/api/admin/promote/1")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_promote_user_admin_success(self, admin_client, db_session):
        from models.profile import CoachProfile
        from core.security import get_password_hash
        user = CoachProfile(
            email="toupgrade@test.com",
            hashed_password=get_password_hash("pass123"),
            full_name="На апгрейд",
            phone="+79990011001",
            role=UserRole.USER
        )
        db_session.add(user)
        db_session.commit()
        
        response = admin_client.patch(f"/api/admin/promote/{user.id}")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["role"] == "admin"
        
        db_session.refresh(user)
        assert user.role == UserRole.ADMIN

    def test_promote_user_not_found(self, admin_client):
        response = admin_client.patch("/api/admin/promote/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_promote_self_forbidden(self, admin_client, admin_coach):
        response = admin_client.patch(f"/api/admin/promote/{admin_coach.id}")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Cannot change your own role" in response.json()["detail"]

    def test_promote_already_admin(self, admin_client, db_session):
        from models.profile import CoachProfile
        from core.security import get_password_hash
        
        already_admin = CoachProfile(
            email="already@admin.com",
            hashed_password=get_password_hash("pass123"),
            full_name="Уже админ",
            phone="+79990011002",
            role=UserRole.ADMIN
        )
        db_session.add(already_admin)
        db_session.commit()
        
        response = admin_client.patch(f"/api/admin/promote/{already_admin.id}")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "User already admin" in response.json()["detail"]