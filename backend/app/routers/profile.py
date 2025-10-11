from fastapi import APIRouter

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("/")
async def get_profile():
    return {"message": "Get profile"}

@router.patch("/")
async def update_profile():
    return {"message": "Update profile"}