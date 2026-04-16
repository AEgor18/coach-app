from .athletes import (
    create_athlete,
    delete_athlete,
    get_athlete,
    get_athletes,
    update_athlete,
    update_athlete_status,
)
from .nutrition import (
    create_nutrition_plan,
    delete_nutrition_plan,
    get_nutrition_plan,
    get_nutrition_plans,
    update_nutrition_plan,
    update_nutrition_status,
)
from .profile import (
    create_coach_profile,
    delete_coach_profile,
    get_coach_profile,
    update_coach_profile,
)
from .reports import (
    create_report,
    delete_report,
    get_report,
    get_reports,
    update_report,
)
from .trainings import (
    create_training_plan,
    delete_training_plan,
    get_training_plan,
    get_training_plans,
    update_training_plan,
    update_training_status,
)

__all__ = [
    "get_athletes",
    "get_athlete",
    "create_athlete",
    "update_athlete",
    "delete_athlete",
    "update_athlete_statusget_training_plans",
    "get_training_plan",
    "create_training_plan",
    "update_training_plan",
    "delete_training_plan",
    "update_training_status",
    "get_nutrition_plans",
    "get_nutrition_plan",
    "create_nutrition_plan",
    "update_nutrition_plan",
    "delete_nutrition_plan",
    "update_nutrition_status",
    "get_reports",
    "get_report",
    "create_report",
    "update_report",
    "delete_report",
    "get_coach_profile",
    "create_coach_profile",
    "update_coach_profile",
    "delete_coach_profile",
]
