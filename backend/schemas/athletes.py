import re
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field, validator

from models.athletes import AthleteStatus, SportType


T = TypeVar("T")


class AthleteBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Имя спортсмена")
    sport_type: SportType
    age: int = Field(..., ge=1, le=120, description="Возраст от 1 до 120 лет")
    phone: str = Field(..., min_length=5, max_length=20, description="Номер телефона")
    progress: int = Field(default=0, ge=0, le=100, description="Прогресс от 0 до 100%")

    @validator("phone")
    def validate_phone(cls, v):
        phone_pattern = r"^[\+]?[0-9\s\-\(\)]{5,20}$"
        if not re.match(phone_pattern, v):
            raise ValueError("Неверный формат номера телефона")
        return v

    @validator("name")
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError("Имя не может быть пустым")
        return v.strip()


class AthleteCreate(AthleteBase):
    pass


class AthleteUpdate(BaseModel):
    name: Optional[str] = Field(
        None, min_length=1, max_length=100, description="Имя спортсмена"
    )
    status: Optional[AthleteStatus] = None
    sport_type: Optional[SportType] = None
    age: Optional[int] = Field(
        None, ge=1, le=120, description="Возраст от 1 до 120 лет"
    )
    phone: Optional[str] = Field(
        None, min_length=5, max_length=20, description="Номер телефона"
    )
    progress: Optional[int] = Field(
        None, ge=0, le=100, description="Прогресс от 0 до 100%"
    )

    @validator("phone")
    def validate_phone(cls, v):
        if v is not None:
            phone_pattern = r"^[\+]?[0-9\s\-\(\)]{5,20}$"
            if not re.match(phone_pattern, v):
                raise ValueError("Неверный формат номера телефона")
        return v

    @validator("name")
    def validate_name(cls, v):
        if v is not None and not v.strip():
            raise ValueError("Имя не может быть пустым")
        return v.strip() if v else v


class AthleteStatusUpdate(BaseModel):
    status: AthleteStatus


class AthleteResponse(AthleteBase):
    id: int
    status: AthleteStatus

    class Config:
        from_attributes = True


class AthleteSimpleResponse(BaseModel):
    id: int
    name: str
    sport_type: SportType

    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel, Generic[T]):
    """Универсальная схема для пагинированных ответов"""

    data: List[T]
    total: int
    page: int
    limit: int
    pages: int

    class Config:
        from_attributes = True
