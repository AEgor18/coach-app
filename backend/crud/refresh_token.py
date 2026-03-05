from datetime import datetime
from sqlalchemy.orm import Session
from models.refresh_token import RefreshToken


def save_refresh_token(
    db: Session, token: str, email: str, expires_at: datetime
):
    db_token = RefreshToken(
        token=token,
        email=email,
        expires_at=expires_at,
    )
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token


def get_refresh_token(db: Session, token: str):
    return db.query(RefreshToken).filter(RefreshToken.token == token).first()


def revoke_refresh_token(db: Session, token: str):
    db_token = get_refresh_token(db, token)
    if db_token:
        db_token.revoked = True
        db.commit()
    return db_token