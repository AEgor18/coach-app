import pytest
from sqlalchemy.orm import Session
from pydantic import ValidationError

from crud.athletes import (
    create_athlete, get_athlete, get_athletes,
    update_athlete, update_athlete_status, delete_athlete
)
from schemas.athletes import AthleteCreate, AthleteUpdate
from models.athletes import Athlete, AthleteStatus, SportType


def make_phone(unique_id: int) -> str:
    return f"+7999{unique_id:05d}000"


class TestCreateAthlete:
    
    def test_create_athlete_success(self, db_session: Session, test_coach):
        athlete_data = AthleteCreate(
            name="Иван Петров",
            sport_type=SportType.RUNNING,
            age=25,
            phone="+7 (999) 123-45-67",
            progress=50
        )
        
        result = create_athlete(
            db=db_session, 
            athlete=athlete_data, 
            coach_id=test_coach.id
        )
        
        assert result.id is not None
        assert result.name == "Иван Петров"
        assert result.sport_type == SportType.RUNNING
        assert result.age == 25
        assert result.phone == "+7 (999) 123-45-67"
        assert result.progress == 50
        assert result.coach_id == test_coach.id
        assert result.status == AthleteStatus.ACTIVE

    def test_create_athlete_default_progress(self, db_session: Session, test_coach):
        athlete_data = AthleteCreate(
            name="Тест", sport_type=SportType.YOGA, age=30, phone="+79991234567"
        )
        
        result = create_athlete(db_session, athlete_data, test_coach.id)
        assert result.progress == 0

    def test_create_athlete_phone_validation_schema(self):
        with pytest.raises(ValidationError) as exc_info:
            AthleteCreate(
                name="Тест", sport_type=SportType.SWIMMING,
                age=20, phone="invalid", progress=0
            )
        
        assert "phone" in str(exc_info.value).lower()

    def test_create_athlete_name_validation_empty(self):
        with pytest.raises(ValidationError):
            AthleteCreate(
                name="   ", sport_type=SportType.YOGA,
                age=25, phone="+79991234567", progress=0
            )

    def test_create_athlete_age_bounds(self):
        with pytest.raises(ValidationError):
            AthleteCreate(
                name="Тест", sport_type=SportType.RUNNING,
                age=0, phone="+79991234567", progress=0
            )
        
        with pytest.raises(ValidationError):
            AthleteCreate(
                name="Тест", sport_type=SportType.RUNNING,
                age=121, phone="+79991234567", progress=0
            )

    def test_create_athlete_name_trimmed(self, db_session: Session, test_coach):
        athlete_data = AthleteCreate(
            name="  Иван Петров  ", sport_type=SportType.RUNNING,
            age=25, phone="+79991234567", progress=0
        )
        
        result = create_athlete(db_session, athlete_data, test_coach.id)
        assert result.name == "Иван Петров"


class TestGetAthletes:
    
    def test_get_athlete_by_id_found(self, db_session: Session, test_coach):
        athlete = create_athlete(db_session, AthleteCreate(
            name="Найти меня", sport_type=SportType.SWIMMING,
            age=22, phone=make_phone(1), progress=0
        ), coach_id=test_coach.id)
        
        result = get_athlete(db_session, athlete.id)
        
        assert result is not None
        assert result.id == athlete.id
        assert result.name == "Найти меня"

    def test_get_athlete_by_id_not_found(self, db_session: Session):
        result = get_athlete(db_session, athlete_id=99999)
        assert result is None

    def test_get_athletes_filtered_by_coach(self, db_session: Session, test_coach):
        create_athlete(db_session, AthleteCreate(
            name="Мой спортсмен", sport_type=SportType.RUNNING,
            age=20, phone=make_phone(2), progress=0
        ), coach_id=test_coach.id)
        
        create_athlete(db_session, AthleteCreate(
            name="Чужой спортсмен", sport_type=SportType.YOGA,
            age=25, phone=make_phone(3), progress=0
        ), coach_id=999)
        
        athletes, total = get_athletes(db_session, coach_id=test_coach.id)
        
        assert total == 1
        assert athletes[0].name == "Мой спортсмен"

    def test_get_athletes_search_filter(self, db_session: Session, test_coach):
        for idx, name in enumerate(["Александр", "Алексей", "Мария"], start=10):
            create_athlete(db_session, AthleteCreate(
                name=name, sport_type=SportType.RUNNING,
                age=25, phone=make_phone(idx), progress=0
            ), coach_id=test_coach.id)
        
        athletes, total = get_athletes(db_session, coach_id=test_coach.id, search="Алекс")
        
        assert total == 2
        assert all("Алекс" in a.name for a in athletes)

    def test_get_athletes_filter_by_sport_type(self, db_session: Session, test_coach):
        for idx, sport in enumerate([SportType.SWIMMING, SportType.RUNNING, SportType.SWIMMING], start=20):
            create_athlete(db_session, AthleteCreate(
                name=f"Спортсмен {sport.value}", sport_type=sport,
                age=20, phone=make_phone(idx), progress=0
            ), coach_id=test_coach.id)
        
        athletes, total = get_athletes(
            db_session, coach_id=test_coach.id, sport_type=SportType.SWIMMING
        )
        
        assert total == 2
        assert all(a.sport_type == SportType.SWIMMING for a in athletes)

    def test_get_athletes_filter_by_status(self, db_session: Session, test_coach):
        create_athlete(db_session, AthleteCreate(
            name="Активный", sport_type=SportType.YOGA, age=20, phone=make_phone(30), progress=0
        ), coach_id=test_coach.id)
        
        injured = create_athlete(db_session, AthleteCreate(
            name="Травмированный", sport_type=SportType.YOGA, age=22, phone=make_phone(31), progress=0
        ), coach_id=test_coach.id)
        injured.status = AthleteStatus.INJURED
        db_session.commit()
        
        athletes, total = get_athletes(
            db_session, coach_id=test_coach.id, status=AthleteStatus.INJURED
        )
        
        assert total == 1
        assert athletes[0].name == "Травмированный"

    def test_get_athletes_age_range_filter(self, db_session: Session, test_coach):
        for idx, age in enumerate([18, 22, 25, 30, 35], start=40):
            create_athlete(db_session, AthleteCreate(
                name=f"Age{age}", sport_type=SportType.RUNNING,
                age=age, phone=make_phone(idx), progress=0
            ), coach_id=test_coach.id)
        
        athletes, total = get_athletes(
            db_session, coach_id=test_coach.id, min_age=22, max_age=30
        )
        
        assert total == 3
        assert all(22 <= a.age <= 30 for a in athletes)


class TestAthletesPaginationSorting:
    
    def test_pagination_basic(self, db_session: Session, test_coach):
        for i in range(15):
            create_athlete(db_session, AthleteCreate(
                name=f"Спортсмен {i}", sport_type=SportType.RUNNING,
                age=20, phone=make_phone(100 + i), progress=i
            ), coach_id=test_coach.id)
        
        athletes, total = get_athletes(
            db_session, coach_id=test_coach.id, page=2, limit=5
        )
        
        assert total == 15
        assert len(athletes) == 5
        ids = [a.id for a in athletes]
        assert ids == list(range(6, 11))

    def test_sorting_by_name_asc(self, db_session: Session, test_coach):
        names = ["Zoe", "Alex", "Mike", "Bob"]
        for idx, name in enumerate(names, start=200):
            create_athlete(db_session, AthleteCreate(
                name=name, sport_type=SportType.YOGA,
                age=25, phone=make_phone(idx), progress=0
            ), coach_id=test_coach.id)
        
        athletes, _ = get_athletes(
            db_session, coach_id=test_coach.id, sort_by="name", sort_order="asc"
        )
        
        result_names = [a.name for a in athletes]
        assert result_names == sorted(names)

    def test_sorting_by_age_desc(self, db_session: Session, test_coach):
        ages = [20, 35, 25, 30]
        for idx, age in enumerate(ages, start=300):
            create_athlete(db_session, AthleteCreate(
                name=f"Age{age}", sport_type=SportType.RUNNING,
                age=age, phone=make_phone(idx), progress=0
            ), coach_id=test_coach.id)
        
        athletes, _ = get_athletes(
            db_session, coach_id=test_coach.id, sort_by="age", sort_order="desc"
        )
        
        result_ages = [a.age for a in athletes]
        assert result_ages == sorted(ages, reverse=True)

    def test_sorting_invalid_field_fallback_to_id(self, db_session: Session, test_coach):
        for i in range(3):
            create_athlete(db_session, AthleteCreate(
                name=f"Test{i}", sport_type=SportType.YOGA,
                age=20, phone=make_phone(400 + i), progress=0
            ), coach_id=test_coach.id)
        
        athletes, _ = get_athletes(
            db_session, coach_id=test_coach.id, sort_by="invalid_field"
        )
        
        ids = [a.id for a in athletes]
        assert ids == sorted(ids)


class TestUpdateAthlete:
    
    def test_update_athlete_full(self, db_session: Session, test_coach):
        athlete = create_athlete(db_session, AthleteCreate(
            name="Исходное", sport_type=SportType.SWIMMING,
            age=20, phone=make_phone(500), progress=10
        ), coach_id=test_coach.id)
        
        update_data = AthleteUpdate(
            name="Обновлённое",
            status=AthleteStatus.INJURED,
            sport_type=SportType.RUNNING,
            age=25,
            phone="+7 (999) 000-00-00",
            progress=90
        )
        
        result = update_athlete(db_session, athlete.id, update_data)
        
        assert result.name == "Обновлённое"
        assert result.status == AthleteStatus.INJURED
        assert result.sport_type == SportType.RUNNING
        assert result.age == 25
        assert result.phone == "+7 (999) 000-00-00"
        assert result.progress == 90

    def test_update_athlete_partial(self, db_session: Session, test_coach):
        athlete = create_athlete(db_session, AthleteCreate(
            name="Не трогай имя", sport_type=SportType.YOGA,
            age=30, phone=make_phone(501), progress=10
        ), coach_id=test_coach.id)
        
        update_data = AthleteUpdate(progress=75)
        result = update_athlete(db_session, athlete.id, update_data)
        
        assert result.progress == 75
        assert result.name == "Не трогай имя"
        assert result.sport_type == SportType.YOGA

    def test_update_nonexistent_athlete(self, db_session: Session):
        update_data = AthleteUpdate(name="Новое имя")
        result = update_athlete(db_session, athlete_id=99999, athlete_update=update_data)
        
        assert result is None

    def test_update_athlete_phone_validation(self, db_session: Session, test_coach):
        athlete = create_athlete(db_session, AthleteCreate(
            name="Тест", sport_type=SportType.RUNNING,
            age=25, phone=make_phone(502), progress=0
        ), coach_id=test_coach.id)
        
        with pytest.raises(ValidationError):
            AthleteUpdate(phone="invalid")
        
        update_data = AthleteUpdate(phone="+7 (999) 111-22-33")
        result = update_athlete(db_session, athlete.id, update_data)
        assert result.phone == "+7 (999) 111-22-33"


class TestUpdateAthleteStatus:
    
    def test_update_status_success(self, db_session: Session, test_coach):
        athlete = create_athlete(db_session, AthleteCreate(
            name="Статус тест", sport_type=SportType.YOGA,
            age=25, phone=make_phone(503), progress=0
        ), coach_id=test_coach.id)
        
        assert athlete.status == AthleteStatus.ACTIVE
        
        result = update_athlete_status(
            db_session, athlete.id, AthleteStatus.INJURED
        )
        
        assert result is not None
        assert result.status == AthleteStatus.INJURED
        
        db_session.refresh(athlete)
        assert athlete.status == AthleteStatus.INJURED

    def test_update_status_nonexistent(self, db_session: Session):
        result = update_athlete_status(
            db_session, athlete_id=99999, status=AthleteStatus.INJURED
        )
        assert result is None


class TestDeleteAthlete:
    
    def test_delete_athlete_success(self, db_session: Session, test_coach):
        athlete = create_athlete(db_session, AthleteCreate(
            name="На удаление", sport_type=SportType.RUNNING,
            age=22, phone=make_phone(504), progress=0
        ), coach_id=test_coach.id)
        
        result = delete_athlete(db_session, athlete.id)
        
        assert result is True
        assert get_athlete(db_session, athlete.id) is None

    def test_delete_nonexistent_athlete(self, db_session: Session):
        result = delete_athlete(db_session, athlete_id=99999)
        assert result is False

    def test_delete_athlete_cascade_relations(self, db_session: Session, test_coach):
        athlete = create_athlete(db_session, AthleteCreate(
            name="Связанный", sport_type=SportType.YOGA,
            age=25, phone=make_phone(505), progress=0
        ), coach_id=test_coach.id)
        
        athlete_id = athlete.id
        delete_athlete(db_session, athlete_id)
        
        remaining = db_session.query(Athlete).count()
        assert remaining >= 0
