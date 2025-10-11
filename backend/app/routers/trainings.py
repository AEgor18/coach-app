from fastapi import APIRouter

router = APIRouter(prefix="/api/trainings", tags=["Trainings"])

@router.get("/plans")
async def get_plans():
    return {"message": "Get training plans"}

@router.post("/plans")
async def create_plan():
    return {"message": "Create training plan"}

@router.post("/sessions")
async def create_session():
    return {"message": "Create training session"}