from fastapi import APIRouter

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/attendance")
async def attendance_report():
    return {"message": "Attendance report"}

@router.post("/performance")
async def create_report():
    return {"message": "Performance report"}