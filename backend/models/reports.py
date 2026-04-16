from sqlalchemy import Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    created_date = Column(Date, nullable=False)
    attendance = Column(Integer, nullable=False)
    trainings = Column(Integer, nullable=False)
    skips = Column(Integer, nullable=False)
    participants = Column(Integer, nullable=False)

    coach_id = Column(Integer, ForeignKey("coach_profile.id"), nullable=False)
    coach = relationship("CoachProfile", backref="reports")
