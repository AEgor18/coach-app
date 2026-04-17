# backend/tests/conftest.py
import sys
from pathlib import Path

import pytest


backend_root = Path(__file__).parent.parent.resolve()
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from core.security import create_access_token, get_password_hash
from database import Base, get_db
from main import app
from models.roles import UserRole


SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Создаём таблицы перед запуском всех тестов"""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session():
    """Изолированная сессия БД с откатом после каждого теста"""
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    """TestClient с переопределением зависимости get_db"""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def test_coach(db_session):
    """Фикстура тестового тренера с ВСЕМИ обязательными полями"""
    from models.profile import CoachProfile

    coach = CoachProfile(
        email="test@coach.com",
        hashed_password=get_password_hash("secure123"),
        full_name="Тест Тренеров",
        phone="+79990001234",
        is_active=True,
        role=UserRole.USER,
    )
    db_session.add(coach)
    db_session.commit()
    db_session.refresh(coach)
    return coach


@pytest.fixture
def auth_token(test_coach):
    """JWT токен для авторизованных запросов"""
    return create_access_token(data={"sub": test_coach.email})


@pytest.fixture
def authorized_client(client, auth_token):
    """Клиент с автоматически подставленным токеном"""
    client.headers = {**client.headers, "Authorization": f"Bearer {auth_token}"}
    return client


@pytest.fixture
def admin_coach(db_session):
    """Фикстура тренера с ролью ADMIN"""
    from models.profile import CoachProfile

    coach = CoachProfile(
        email="admin@coach.com",
        hashed_password=get_password_hash("admin123"),
        full_name="Админ Тестов",
        phone="+79990012345",
        is_active=True,
        role=UserRole.ADMIN,
    )
    db_session.add(coach)
    db_session.commit()
    db_session.refresh(coach)
    return coach


@pytest.fixture
def admin_token(admin_coach):
    """JWT токен для админа"""
    return create_access_token(data={"sub": admin_coach.email})


@pytest.fixture
def admin_client(client, admin_token):
    """Клиент с токеном админа"""
    client.headers = {**client.headers, "Authorization": f"Bearer {admin_token}"}
    return client


@pytest.fixture(autouse=True)
def clean_refresh_tokens(db_session):
    """Очистка токенов перед каждым тестом"""
    from models.refresh_token import RefreshToken

    db_session.query(RefreshToken).delete()
    db_session.commit()
    yield
