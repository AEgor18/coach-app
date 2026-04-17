import pytest
from sqlalchemy.orm import Session

from crud.profile import (
    authenticate_coach,
    create_coach_profile,
    update_coach_profile,
)
from models.roles import UserRole
from schemas.profile import CoachProfileCreate, CoachProfileUpdate


class TestProfileCRUD:
    def test_create_coach_first_user_is_admin(self, db_session: Session):
        from models.profile import CoachProfile

        db_session.query(CoachProfile).delete()
        db_session.commit()

        profile_data = CoachProfileCreate(
            full_name="Админ Тестов",
            phone="+79990001111",
            email="admin@test.com",
            password="SecurePass123!",
        )

        result = create_coach_profile(db_session, profile_data)

        assert result.role == UserRole.ADMIN
        assert result.email == "admin@test.com"
        assert result.hashed_password != "SecurePass123!"

    def test_create_coach_subsequent_user_is_regular(
        self, db_session: Session, test_coach
    ):
        profile_data = CoachProfileCreate(
            full_name="Обычный Тренер",
            phone="+79990002222",
            email="regular@test.com",
            password="AnotherPass456!",
        )

        result = create_coach_profile(db_session, profile_data)
        assert result.role == UserRole.USER

    def test_create_coach_duplicate_email(self, db_session: Session):
        create_coach_profile(
            db_session,
            CoachProfileCreate(
                full_name="Первый Тренер",
                phone="+79990003333",
                email="dup@test.com",
                password="SecurePass123!",
            ),
        )

        with pytest.raises(ValueError, match="Email already registered"):
            create_coach_profile(
                db_session,
                CoachProfileCreate(
                    full_name="Второй Тренер",
                    phone="+79990004444",
                    email="dup@test.com",
                    password="AnotherPass456!",
                ),
            )

    def test_authenticate_coach_success(self, db_session: Session):
        profile = create_coach_profile(
            db_session,
            CoachProfileCreate(
                full_name="Для входа",
                phone="+79990005555",
                email="auth@test.com",
                password="CorrectPass123",
            ),
        )

        result = authenticate_coach(db_session, "auth@test.com", "CorrectPass123")

        assert result is not None
        assert result.id == profile.id
        assert result.email == "auth@test.com"

    def test_authenticate_coach_wrong_password(self, db_session: Session):
        create_coach_profile(
            db_session,
            CoachProfileCreate(
                full_name="Тест",
                phone="+79990006666",
                email="wrong@test.com",
                password="RightPass123",
            ),
        )

        result = authenticate_coach(db_session, "wrong@test.com", "WrongPass456")
        assert result is None

    def test_authenticate_coach_nonexistent_email(self, db_session: Session):
        result = authenticate_coach(db_session, "nobody@test.com", "AnyPass123")
        assert result is None

    def test_password_truncation_72_chars(self, db_session: Session):
        long_password = "A" * 72

        create_coach_profile(
            db_session,
            CoachProfileCreate(
                full_name="LongPass",
                phone="+79990007777",
                email="long@test.com",
                password=long_password,
            ),
        )

        result = authenticate_coach(db_session, "long@test.com", long_password)
        assert result is not None

    def test_update_coach_profile_password_hashing(
        self, db_session: Session, test_coach
    ):
        update_data = CoachProfileUpdate(password="NewSecurePass!")
        result = update_coach_profile(db_session, update_data)

        assert result is not None
        auth = authenticate_coach(db_session, test_coach.email, "NewSecurePass!")
        assert auth is not None
