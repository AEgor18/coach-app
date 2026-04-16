import httpx
from fastapi import HTTPException
from pydantic import BaseModel
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_fixed

from core.config import settings


class WeatherData(BaseModel):
    city: str
    temperature: float
    feels_like: float
    humidity: int
    wind_speed: float
    description: str
    icon: str
    recommendation: str


class WeatherService:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=10.0)
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = settings.OPENWEATHER_BASE_URL

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_fixed(2),
        retry=retry_if_exception_type((httpx.TimeoutException, httpx.ConnectError)),
    )
    async def get_current_weather(self, city: str = "Moscow") -> WeatherData:
        if not self.api_key:
            raise HTTPException(status_code=503, detail="Weather service not configured")

        url = f"{self.base_url}/weather"
        params = {"q": city, "appid": self.api_key, "units": "metric", "lang": "ru"}

        try:
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            weather = WeatherData(
                city=data["name"],
                temperature=round(data["main"]["temp"], 1),
                feels_like=round(data["main"]["feels_like"], 1),
                humidity=data["main"]["humidity"],
                wind_speed=round(data["wind"]["speed"], 1),
                description=data["weather"][0]["description"].capitalize(),
                icon=data["weather"][0]["icon"],
                recommendation=self._get_training_recommendation(
                    data["main"]["temp"], data["weather"][0]["main"]
                ),
            )
            return weather

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise HTTPException(404, f"City '{city}' not found")
            raise HTTPException(502, "Weather service error")
        except Exception as e:
            raise HTTPException(503, f"Weather service unavailable: {str(e)}")

    def _get_training_recommendation(self, temp: float, condition: str) -> str:
        if temp < 0:
            return "Холодно. Рекомендуется тренировка в зале."
        elif temp < 10:
            return "Прохладно. Одевайтесь теплее."
        elif temp > 30:
            return "Жарко. Избегайте интенсивных нагрузок на улице."
        elif condition in ["Thunderstorm", "Rain"]:
            return "Дождь/гроза. Лучше перенести тренировку в помещение."
        return "Хорошая погода для тренировки на улице!"

    async def close(self):
        await self.client.aclose()


weather_service = WeatherService()
