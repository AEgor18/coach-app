from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from core.security import verify_token
from crud.profile import get_coach_by_email
from database import get_db

security = HTTPBearer()


async def get_current_coach(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    payload = verify_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid access token")

    email = payload.get("sub")
    coach = get_coach_by_email(db, email)

    if not coach:
        raise HTTPException(status_code=401, detail="Coach not found")

    if not coach.is_active:
        raise HTTPException(status_code=400, detail="Inactive coach")

    return coach
