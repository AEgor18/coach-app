from datetime import date, timedelta

from sqlalchemy.orm import Session

from crud.athletes import create_athlete
from crud.trainings import create_training_plan, update_training_status
from models.athletes import SportType
from schemas.athletes import AthleteCreate
from schemas.trainings import TrainingPlanCreate


class TestTrainingsCRUD:
    def test_create_training_plan_success(self, db_session: Session, test_coach):
        athlete = create_athlete(
            db_session,
            AthleteCreate(
                name="Для тренировки",
                sport_type=SportType.RUNNING,
                age=25,
                phone="+79990002001",
                progress=0,
            ),
            coach_id=test_coach.id,
        )

        plan_data = TrainingPlanCreate(
            date=date.today() + timedelta(days=1),
            title="Утренняя пробежка",
            training_type="Кардио",
            duration=45,
            skill_level="Средний",
            description="Лёгкий бег 5 км",
            athlete_ids=[athlete.id],
        )

        result = create_training_plan(db_session, plan_data, test_coach.id)

        assert result.id is not None
        assert result.title == "Утренняя пробежка"
        assert result.duration == 45
        assert result.coach_id == test_coach.id
        assert len(result.athletes) == 1

    def test_update_training_status(self, db_session: Session, test_coach):
        athlete = create_athlete(
            db_session,
            AthleteCreate(
                name="Тест",
                sport_type=SportType.YOGA,
                age=20,
                phone="+79990002002",
                progress=0,
            ),
            coach_id=test_coach.id,
        )

        plan = create_training_plan(
            db_session,
            TrainingPlanCreate(
                date=date.today(),
                title="Тест",
                training_type="Силовые",
                duration=30,
                skill_level="Начальный",
                description="",
                athlete_ids=[athlete.id],
            ),
            test_coach.id,
        )

        result = update_training_status(db_session, plan.id, "Завершенная")

        assert result.status == "Завершенная"
