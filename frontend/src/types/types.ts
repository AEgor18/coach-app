export type AthletesData = {
  name: string;
  sport_type: string;
  age: number;
  phone: string;
  progress: number;
  id: number;
  status: string;
};

export type UserData = {
  full_name: string;
  email: string;
  phone: string;
  id: number;
  is_active: boolean;
};

export type NestedAthlete = {
  id: number;
  name: string;
  sport_type: string;
};

export type TrainingsPlan = {
  date: string;
  title: string;
  training_type: string;
  duration: number;
  skill_level: string;
  description: string;
  athlete_ids?: Array<number>;
  id: number;
  status: string;
  athletes: NestedAthlete[];
};

export interface AthleteFormData {
  name: string;
  status: AthleteStatus;
  sport_type: SportType;
  age: number;
  phone: string;
  progress: number;
}

export type AthleteStatus = "Активен" | "Травма";
export type SportType = "Плавание" | "Бег" | "Силовой тренинг" | "Йога";
export interface TrainingFormData {
  date: string;
  title: string;
  training_type: TrainingType;
  status: TrainingStatus;
  duration: number;
  skill_level: SkillLevel;
  description: string;
  athlete_ids: number[];
}

export type TrainingType =
  | "Индивидуальные"
  | "Силовые"
  | "Групповые"
  | "Кардио";
export type TrainingStatus = "Запланированная" | "В процессе" | "Завершенная";
export type SkillLevel =
  | "Начальный"
  | "Средний"
  | "Продвинутый"
  | "Профессиональный";

export type NutritionPlan = {
  title: string;
  nutrition_type: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  period_weeks: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  description: string;
  athlete_ids: number[];
  id: number;
  status: string;
  athletes: NestedAthlete[];
};

export interface NutritionFormData {
  title: string;
  nutrition_type:
    | "набор массы"
    | "снижение веса"
    | "поддержание"
    | "восстановление";
  status: "Активен" | "Завершен";
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  period_weeks: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  description: string;
  athlete_ids: number[];
}

export type ReportData = {
  title: string;
  start_date: string;
  end_date: string;
  created_date: string;
  attendance: number;
  trainings: number;
  skips: number;
  participants: number;
  id: number;
};

export interface ReportFormData {
  title: string;
  start_date: string;
  end_date: string;
  created_date: string;
  attendance: number;
  trainings: number;
  skips: number;
  participants: number;
}
