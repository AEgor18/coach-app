import re
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, validator

from models.roles import UserRole


class CoachProfileBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100, description="ФИО тренера")
    phone: str = Field(..., min_length=5, max_length=20, description="Номер телефона")
    email: EmailStr = Field(..., description="Email тренера")

    @validator("phone")
    def validate_phone(cls, v):
        phone_pattern = r"^[\+]?[0-9\s\-\(\)]{5,20}$"
        if not re.match(phone_pattern, v):
            raise ValueError("Неверный формат номера телефона")
        return v

    @validator("full_name")
    def validate_full_name(cls, v):
        if not v.strip():
            raise ValueError("ФИО не может быть пустым")
        return v.strip()


class CoachProfileCreate(CoachProfileBase):
    password: str = Field(
        ..., min_length=8, max_length=72, description="Пароль (8-72 символа)"
    )


class CoachProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, min_length=5, max_length=20)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6, max_length=72)


class CoachProfileResponse(CoachProfileBase):
    id: int
    is_active: bool
    role: UserRole
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class RefreshRequest(BaseModel):
    refresh_token: str
