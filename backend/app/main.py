from fastapi import FastAPI
from app.routers import auth, athletes, trainings, calendar, reports, profile

app = FastAPI(
    title="Fitness Coach App",
    description="API для приложения тренера",
    version="1.0.0"
)

app.include_router(auth.router)
app.include_router(athletes.router)
app.include_router(trainings.router)
app.include_router(calendar.router)
app.include_router(reports.router)
app.include_router(profile.router)

@app.get("/")
async def root():
    return {"message": "Fitness Coach App API"}

@app.get("/health")
async def health_check():
    return {"status": "OK"}
