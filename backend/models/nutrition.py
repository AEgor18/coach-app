from enum import Enum

from sqlalchemy import Column, ForeignKey, Integer, String, Table, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship

from database import Base

nutrition_athletes = Table(
    "nutrition_athletes",
    Base.metadata,
    Column("nutrition_plan_id", Integer, ForeignKey("nutrition_plans.id")),
    Column("athlete_id", Integer, ForeignKey("athletes.id")),
)


class NutritionType(str, Enum):
    MASS_GAIN = "набор массы"
    WEIGHT_LOSS = "снижение веса"
    MAINTENANCE = "поддержание"
    RECOVERY = "восстановление"


class NutritionStatus(str, Enum):
    ACTIVE = "Активен"
    COMPLETED = "Завершен"


class NutritionPlan(Base):
    __tablename__ = "nutrition_plans"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    status = Column(SQLEnum(NutritionStatus), default=NutritionStatus.ACTIVE)
    nutrition_type = Column(SQLEnum(NutritionType), nullable=False)
    calories = Column(Integer, nullable=False)
    protein = Column(Integer, nullable=False)
    fats = Column(Integer, nullable=False)
    carbs = Column(Integer, nullable=False)
    period_weeks = Column(Integer, nullable=False)
    breakfast = Column(Text, nullable=False)
    lunch = Column(Text, nullable=False)
    dinner = Column(Text, nullable=False)
    description = Column(Text, default="")

    coach_id = Column(Integer, ForeignKey("coach_profile.id"), nullable=False)
    coach = relationship("CoachProfile", backref="nutrition_plans")

    athletes = relationship(
        "Athlete", secondary=nutrition_athletes, back_populates="nutrition_plans"
    )
