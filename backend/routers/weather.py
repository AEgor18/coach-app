from fastapi import APIRouter, Depends, Query, HTTPException
from services.weather import weather_service, WeatherData
from dependencies.auth import get_current_coach
from models.profile import CoachProfile

router = APIRouter(
    prefix="/api/weather",
    tags=["Weather"]
)

@router.get("/current", response_model=WeatherData)
async def get_current_weather(
    city: str = Query("Moscow", description="Название города"),
    coach: CoachProfile = Depends(get_current_coach)
):
    """
    Получить текущую погоду для планирования тренировок.
    Доступно только авторизованным пользователям.
    """
    try:
        weather_data = await weather_service.get_current_weather(city)
        return weather_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=503, detail="Не удалось получить данные о погоде")