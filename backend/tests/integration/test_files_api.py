import pytest
from fastapi import status
from unittest.mock import patch, Mock


class TestFileEndpoints:
    
    def test_upload_avatar_success(self, authorized_client, test_coach):
        with patch("core.s3.s3_storage.upload_file") as mock_upload:
            mock_upload.return_value = f"avatars/{test_coach.id}_test.jpg"
            
            response = authorized_client.post(
                "/api/profile/avatar",
                files={"file": ("test.jpg", b"fake image data", "image/jpeg")}
            )
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            # ✅ Универсальная проверка
            assert data["avatar_url"].startswith("avatars/")
            assert data["avatar_url"].endswith("_test.jpg")
            assert str(test_coach.id) in data["avatar_url"]

    def test_upload_avatar_content_type_validation(self, authorized_client):
        response = authorized_client.post(
            "/api/profile/avatar",
            files={"file": ("doc.pdf", b"pdf content", "application/pdf")}
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Only JPEG or PNG" in response.json()["detail"]

    def test_upload_avatar_size_validation(self, authorized_client):
        large_content = b"x" * (3 * 1024 * 1024)
        response = authorized_client.post(
            "/api/profile/avatar",
            files={"file": ("large.jpg", large_content, "image/jpeg")}
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "File too large" in response.json()["detail"]

    def test_upload_avatar_s3_error(self, authorized_client):
        with patch("core.s3.s3_storage.upload_file") as mock_upload:
            mock_upload.side_effect = RuntimeError("S3 connection failed")
            
            response = authorized_client.post(
                "/api/profile/avatar",
                files={"file": ("photo.jpg", b"fake data", "image/jpeg")}
            )
            assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
            assert "S3 upload error" in response.json()["detail"]

    def test_delete_avatar_success_mocked_s3(self, authorized_client, test_coach, db_session):
        test_coach.avatar_url = "avatars/123_old.jpg"
        db_session.commit()
        
        with patch("core.s3.s3_storage.delete_file") as mock_delete:
            mock_delete.return_value = True
            
            response = authorized_client.delete("/api/profile/avatar")
            assert response.status_code == status.HTTP_200_OK
            assert response.json()["message"] == "Avatar deleted"
            mock_delete.assert_called_once_with("avatars/123_old.jpg")

    def test_delete_avatar_not_found(self, authorized_client, test_coach, db_session):
        test_coach.avatar_url = None
        db_session.commit()
        
        response = authorized_client.delete("/api/profile/avatar")
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Avatar not found" in response.json()["detail"]

    def test_delete_avatar_s3_error(self, authorized_client, test_coach, db_session):
        test_coach.avatar_url = "avatars/123_old.jpg"
        db_session.commit()
        
        with patch("core.s3.s3_storage.delete_file") as mock_delete:
            mock_delete.side_effect = RuntimeError("S3 delete failed")
            
            response = authorized_client.delete("/api/profile/avatar")
            assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
            assert "S3 delete error" in response.json()["detail"]