from fastapi import APIRouter

router = APIRouter(prefix="/api/athletes", tags=["Athletes"])

@router.get("/")
async def get_athletes():
    return {"message": "Get athletes"}

@router.post("/")
async def create_athlete():
    return {"message": "Create athlete"}

@router.get("/{athlete_id}")
async def get_athlete(athlete_id: int):
    return {"message": f"Get athlete {athlete_id}"}

@router.patch("/{athlete_id}/injury")
async def mark_injury(athlete_id: int):
    return {"message": f"Mark injury for {athlete_id}"}