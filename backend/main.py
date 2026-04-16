from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from core.seo import seo_router
from database import Base, engine
from middleware.auth import AuthMiddleware
from routers import admin, athletes, nutrition, profile, reports, trainings, weather

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fitness Coach App",
    description="API для приложения тренера",
    version="1.0.0",
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
app.include_router(seo_router)
app.include_router(athletes.router)
app.include_router(trainings.router)
app.include_router(nutrition.router)
app.include_router(reports.router)
app.include_router(profile.router)
app.include_router(admin.router)
app.include_router(weather.router)


@app.get("/")
async def root():
    return {"message": "Fitness Coach App API is running"}


@app.get("/health")
async def health_check():
    return {"status": "OK"}


frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"

if frontend_dist.exists():

    @app.exception_handler(404)
    async def spa_404_handler(request: Request, exc):
        if request.url.path.startswith("/api/"):
            return {"detail": "Not Found"}

        index_file = frontend_dist / "index.html"
        if index_file.exists():
            return HTMLResponse(content=index_file.read_text(encoding="utf-8"), status_code=200)

        return HTMLResponse(content="<h1>404 - Page Not Found</h1>", status_code=404)

    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="spa")
else:
    print(f"Warning: Frontend build not found at {frontend_dist}. SPA routing will not work.")


@app.get("/api/info")
async def app_info():
    return {
        "name": "Fitness Coach App",
        "version": "1.0.0",
        "description": "Приложение для управления тренировками спортсменов",
        "seo_endpoints": ["/sitemap.xml", "/robots.txt", "/json-ld"],
    }
