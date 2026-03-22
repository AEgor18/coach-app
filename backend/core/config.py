from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    PROJECT_NAME: str = "Fitness Coach App"

    AWS_ACCESS_KEY: str = "minioadmin"          
    AWS_SECRET_KEY: str = "minioadmin"          
    AWS_REGION: str = "us-east-1"
    AWS_BUCKET_NAME: str = "avatars"          
    AWS_ENDPOINT_URL: str = "http://127.0.0.1:9000"
    class Config:
        env_file = ".env"


settings = Settings()
