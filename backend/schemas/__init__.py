from .athletes import (
    AthleteBase,
    AthleteCreate,
    AthleteResponse,
    AthleteSimpleResponse,
    AthleteStatus,
    AthleteUpdate,
    SportType,
)
from .nutrition import (
    NutritionPlanBase,
    NutritionPlanCreate,
    NutritionPlanResponse,
    NutritionPlanUpdate,
    NutritionStatus,
    NutritionType,
)
from .profile import (
    CoachProfileBase,
    CoachProfileCreate,
    CoachProfileResponse,
    CoachProfileUpdate,
)
from .reports import ReportBase, ReportCreate, ReportResponse, ReportUpdate
from .trainings import (
    SkillLevel,
    TrainingPlanBase,
    TrainingPlanCreate,
    TrainingPlanResponse,
    TrainingPlanUpdate,
    TrainingStatus,
    TrainingType,
)

__all__ = [
    # Athletes
    "SportType",
    "AthleteStatus",
    "AthleteBase",
    "AthleteCreate",
    "AthleteUpdate",
    "AthleteResponse",
    "AthleteSimpleResponse",
    # Trainings
    "TrainingType",
    "TrainingStatus",
    "SkillLevel",
    "TrainingPlanBase",
    "TrainingPlanCreate",
    "TrainingPlanUpdate",
    "TrainingPlanResponse",
    # Nutrition
    "NutritionType",
    "NutritionStatus",
    "NutritionPlanBase",
    "NutritionPlanCreate",
    "NutritionPlanUpdate",
    "NutritionPlanResponse",
    # Reports
    "ReportBase",
    "ReportCreate",
    "ReportUpdate",
    "ReportResponse",
    # Profile
    "CoachProfileBase",
    "CoachProfileCreate",
    "CoachProfileUpdate",
    "CoachProfileResponse",
]
