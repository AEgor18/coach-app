from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import athletes, trainings, nutrition, reports, profile
from database import engine, Base
from middleware.auth import AuthMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fitness Coach App",
    description="API для приложения тренера",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(AuthMiddleware)

app.include_router(athletes.router)
app.include_router(trainings.router)
app.include_router(nutrition.router)
app.include_router(reports.router)
app.include_router(profile.router)

@app.get("/")
async def root():
    return {"message": "Fitness Coach App API"}

@app.get("/health")
async def health_check():
    return {"status": "OK"}