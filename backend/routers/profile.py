from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from crud.profile import (
    create_coach_profile,
    delete_coach_profile,
    get_coach_by_email,
    update_coach_profile,
    authenticate_coach,
)
from database import get_db
from dependencies.auth import get_current_coach
from models.profile import CoachProfile
from schemas.profile import (
    CoachProfileCreate,
    CoachProfileResponse,
    CoachProfileUpdate,
    LoginRequest,
    Token,
)
from core.security import create_access_token, create_refresh_token, verify_token

router = APIRouter(prefix="/api/profile", tags=["Coach Profile"])


@router.post("/register", response_model=CoachProfileResponse)
async def register_coach(profile: CoachProfileCreate, db: Session = Depends(get_db)):
    try:
        return create_coach_profile(db=db, profile=profile)
    except ValueError as e:
        raise HTTPException(400, detail=str(e))


@router.post("/login", response_model=Token)
async def login_coach(login_data: LoginRequest, db: Session = Depends(get_db)):
    coach = authenticate_coach(db, login_data.email, login_data.password)
    if not coach:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token({"sub": coach.email})
    refresh_token = create_refresh_token({"sub": coach.email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str):
    payload = verify_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(401, detail="Invalid refresh token")

    new_access = create_access_token({"sub": payload["sub"]})

    return {"access_token": new_access, "token_type": "bearer"}


@router.get("/me", response_model=CoachProfileResponse)
async def get_current_coach_profile(coach: CoachProfile = Depends(get_current_coach)):
    return coach


@router.put("/", response_model=CoachProfileResponse)
async def update_coach_profile_data(
        profile_update: CoachProfileUpdate,
        db: Session = Depends(get_db),
        coach: CoachProfile = Depends(get_current_coach)
):
    updated = update_coach_profile(db, profile_update)
    if not updated:
        raise HTTPException(404, detail="Coach not found")
    return updated


@router.delete("/", status_code=204)
async def delete_coach_profile_endpoint(
        db: Session = Depends(get_db),
        coach: CoachProfile = Depends(get_current_coach)
):
    deleted = delete_coach_profile(db)
    if not deleted:
        raise HTTPException(404, detail="Coach not found")
    return None
