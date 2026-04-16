from typing import Optional

from sqlalchemy.orm import Session

from core.security import get_password_hash, verify_password
from models.profile import CoachProfile
from models.roles import UserRole
from schemas.profile import CoachProfileCreate, CoachProfileUpdate


def get_coach_by_email(db: Session, email: str) -> Optional[CoachProfile]:
    return db.query(CoachProfile).filter(CoachProfile.email == email).first()


def get_coach_profile(db: Session, email: str) -> Optional[CoachProfile]:
    return get_coach_by_email(db, email)


def create_coach_profile(db: Session, profile: CoachProfileCreate) -> CoachProfile:
    existing = get_coach_by_email(db, profile.email)
    if existing:
        raise ValueError("Email already registered")

    password = profile.password[:72]
    hashed_password = get_password_hash(password)

    users_count = db.query(CoachProfile).count()

    if users_count == 0:
        role = UserRole.ADMIN
    else:
        role = UserRole.USER

    db_profile = CoachProfile(
        full_name=profile.full_name,
        phone=profile.phone,
        email=profile.email,
        hashed_password=hashed_password,
        role=role,
    )

    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def authenticate_coach(db: Session, email: str, password: str) -> Optional[CoachProfile]:
    coach = get_coach_by_email(db, email)
    if not coach:
        return None

    password = password[:72]
    if not verify_password(password, coach.hashed_password):
        return None

    return coach


def update_coach_profile(db: Session, profile_update: CoachProfileUpdate) -> Optional[CoachProfile]:
    db_profile = db.query(CoachProfile).first()
    if not db_profile:
        return None

    update_data = profile_update.dict(exclude_unset=True)

    if "password" in update_data:
        password = update_data["password"][:72]
        update_data["hashed_password"] = get_password_hash(password)
        del update_data["password"]

    for field, value in update_data.items():
        setattr(db_profile, field, value)

    db.commit()
    db.refresh(db_profile)
    return db_profile


def delete_coach_profile(db: Session) -> bool:
    db_profile = db.query(CoachProfile).first()
    if not db_profile:
        return False

    db.delete(db_profile)
    db.commit()
    return True
