from enum import Enum
from sqlalchemy import Column, Integer, String, Enum as SQLEnum, Date, Text, Table, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

training_athletes = Table(
    'training_athletes',
    Base.metadata,
    Column('training_plan_id', Integer, ForeignKey('training_plans.id')),
    Column('athlete_id', Integer, ForeignKey('athletes.id'))
)


class TrainingType(str, Enum):
    INDIVIDUAL = "Индивидуальные"
    STRENGTH = "Силовые"
    GROUP = "Групповые"
    CARDIO = "Кардио"


class TrainingStatus(str, Enum):
    PLANNED = "Запланированная"
    IN_PROGRESS = "В процессе"
    COMPLETED = "Завершенная"


class SkillLevel(str, Enum):
    BEGINNER = "Начальный"
    INTERMEDIATE = "Средний"
    ADVANCED = "Продвинутый"
    PROFESSIONAL = "Профессиональный"


class TrainingPlan(Base):
    __tablename__ = "training_plans"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    title = Column(String(100), nullable=False)
    training_type = Column(SQLEnum(TrainingType), nullable=False)
    status = Column(SQLEnum(TrainingStatus), default=TrainingStatus.PLANNED)
    duration = Column(Integer, nullable=False)
    skill_level = Column(SQLEnum(SkillLevel), nullable=False)
    description = Column(Text, default="")

    athletes = relationship("Athlete", secondary=training_athletes, back_populates="training_plans")