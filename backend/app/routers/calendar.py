from fastapi import APIRouter

router = APIRouter(prefix="/api/calendar", tags=["Calendar"])

@router.get("/{date}")
async def get_day(date: str):
    return {"message": f"Get calendar for {date}"}

@router.post("/sessions/{session_id}/attendance")
async def mark_attendance(session_id: int):
    return {"message": f"Mark attendance for {session_id}"}