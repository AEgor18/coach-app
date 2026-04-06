import pytest
from sqlalchemy.orm import Session

from crud.nutrition import (
    create_nutrition_plan, get_nutrition_plan, 
    update_nutrition_plan, delete_nutrition_plan
)
from schemas.nutrition import NutritionPlanCreate, NutritionPlanUpdate
from models.athletes import SportType
from models.nutrition import NutritionStatus, NutritionType
from crud.athletes import create_athlete
from schemas.athletes import AthleteCreate


class TestNutritionCRUD:
    
    def test_create_nutrition_plan_success(self, db_session: Session, test_coach):
        athlete = create_athlete(db_session, AthleteCreate(
            name="Для питания", sport_type=SportType.RUNNING,
            age=25, phone="+79990001001", progress=0
        ), coach_id=test_coach.id)
        
        plan_data = NutritionPlanCreate(
            title="План набора массы",
            nutrition_type="набор массы",
            calories=2500,
            protein=150,
            fats=70,
            carbs=300,
            period_weeks=8,
            breakfast="Овсянка + яйца",
            lunch="Курица + рис",
            dinner="Рыба + овощи",
            athlete_ids=[athlete.id]
        )
        
        result = create_nutrition_plan(db_session, plan_data, test_coach.id)
        
        assert result.id is not None
        assert result.title == "План набора массы"
        assert result.calories == 2500
        assert len(result.athletes) == 1
        assert result.athletes[0].id == athlete.id
        assert result.coach_id == test_coach.id

    def test_create_nutrition_plan_empty_athletes(self, db_session: Session, test_coach):
        plan_data = NutritionPlanCreate(
            title="Общий план", nutrition_type="поддержание",
            calories=2000, protein=100, fats=60, carbs=250,
            period_weeks=4, breakfast="Завтрак", lunch="Обед", dinner="Ужин",
            athlete_ids=[]
        )
        
        result = create_nutrition_plan(db_session, plan_data, test_coach.id)
        assert result.id is not None
        assert len(result.athletes) == 0

    def test_update_nutrition_plan_partial(self, db_session: Session, test_coach):
        athlete = create_athlete(db_session, AthleteCreate(
            name="Тест", sport_type=SportType.YOGA, age=20, phone="+79990001002", progress=0
        ), coach_id=test_coach.id)
        
        plan = create_nutrition_plan(db_session, NutritionPlanCreate(
            title="Исходный", nutrition_type="поддержание",
            calories=2000, protein=100, fats=60, carbs=250,
            period_weeks=4, breakfast="Завтрак", lunch="Обед", dinner="Ужин",
            athlete_ids=[athlete.id]
        ), test_coach.id)
        
        update_data = NutritionPlanUpdate(calories=2200, description="Обновлено")
        result = update_nutrition_plan(db_session, plan.id, update_data)
        
        assert result.calories == 2200
        assert result.description == "Обновлено"
        assert result.title == "Исходный"
        assert len(result.athletes) == 1

    def test_update_nutrition_athletes_relation(self, db_session: Session, test_coach):
        a1 = create_athlete(db_session, AthleteCreate(
            name="A1", sport_type=SportType.RUNNING, age=20, phone="+79990001003", progress=0
        ), coach_id=test_coach.id)
        a2 = create_athlete(db_session, AthleteCreate(
            name="A2", sport_type=SportType.YOGA, age=22, phone="+79990001004", progress=0
        ), coach_id=test_coach.id)
        
        plan = create_nutrition_plan(db_session, NutritionPlanCreate(
            title="Тест", nutrition_type="поддержание",
            calories=2000, protein=100, fats=60, carbs=250,
            period_weeks=4, breakfast="Завтрак", lunch="Обед", dinner="Ужин",
            athlete_ids=[a1.id]
        ), test_coach.id)
        
        update_data = NutritionPlanUpdate(athlete_ids=[a2.id])
        result = update_nutrition_plan(db_session, plan.id, update_data)
        
        assert len(result.athletes) == 1
        assert result.athletes[0].id == a2.id

    def test_delete_nutrition_plan_success(self, db_session: Session, test_coach):
        plan = create_nutrition_plan(db_session, NutritionPlanCreate(
            title="На удаление", nutrition_type="поддержание",
            calories=2000, protein=100, fats=60, carbs=250,
            period_weeks=4, breakfast="Завтрак", lunch="Обед", dinner="Ужин",
            athlete_ids=[]
        ), test_coach.id)
        
        result = delete_nutrition_plan(db_session, plan.id)
        
        assert result is True
        assert get_nutrition_plan(db_session, plan.id) is None
