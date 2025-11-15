from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class CoachProfile(Base):
    __tablename__ = "coach_profile"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=False, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False) 
    is_active = Column(Boolean, default=True)