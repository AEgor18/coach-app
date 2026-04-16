from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies.auth import get_current_admin
from models.profile import CoachProfile
from models.roles import UserRole
from schemas.profile import CoachProfileResponse

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/coaches", response_model=List[CoachProfileResponse])
async def get_all_coaches(
    db: Session = Depends(get_db),
    admin: CoachProfile = Depends(get_current_admin),
):
    return db.query(CoachProfile).all()


@router.patch("/promote/{user_id}", response_model=CoachProfileResponse)
async def promote_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: CoachProfile = Depends(get_current_admin),
):
    user = db.query(CoachProfile).filter(CoachProfile.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")

    if user.role == UserRole.ADMIN:
        raise HTTPException(status_code=400, detail="User already admin")

    user.role = UserRole.ADMIN

    db.commit()
    db.refresh(user)

    return user
