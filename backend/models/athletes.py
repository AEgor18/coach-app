from enum import Enum

from sqlalchemy import Column
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship

from database import Base


class SportType(str, Enum):
    SWIMMING = "Плавание"
    RUNNING = "Бег"
    STRENGTH_TRAINING = "Силовой тренинг"
    YOGA = "Йога"


class AthleteStatus(str, Enum):
    ACTIVE = "Активен"
    INJURED = "Травма"


class Athlete(Base):
    __tablename__ = "athletes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    status = Column(SQLEnum(AthleteStatus), default=AthleteStatus.ACTIVE)
    sport_type = Column(SQLEnum(SportType), nullable=False)
    age = Column(Integer, nullable=False)
    phone = Column(String(20), nullable=False)
    progress = Column(Integer, default=0)

    training_plans = relationship(
        "TrainingPlan", secondary="training_athletes", back_populates="athletes"
    )
    nutrition_plans = relationship(
        "NutritionPlan", secondary="nutrition_athletes", back_populates="athletes"
    )
