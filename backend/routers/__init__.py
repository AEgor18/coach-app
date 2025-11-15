from .athletes import router as athletes_router
from .nutrition import router as nutrition_router
from .profile import router as profile_router
from .reports import router as reports_router
from .trainings import router as trainings_router

__all__ = [
    "athletes_router",
    "trainings_router",
    "nutrition_router",
    "reports_router",
    "profile_router",
]
