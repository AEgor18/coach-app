import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Box,
  Typography,
  Divider,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import type {
  TrainingFormData,
  AthletesData,
  TrainingsPlan,
} from "../../../types/types";
import { getAllAthletes } from "../../../api/athletes";

interface EditTrainingModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (trainingData: TrainingFormData) => void;
  training: TrainingsPlan | null;
  loading?: boolean;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const EditTrainingModal: React.FC<EditTrainingModalProps> = ({
  open,
  onClose,
  onSave,
  training,
  loading = false,
}) => {
  const [formData, setFormData] = React.useState<TrainingFormData>({
    title: "",
    training_type: "Индивидуальные",
    status: "Запланированная",
    date: new Date().toISOString().split("T")[0],
    duration: 60,
    skill_level: "Начальный",
    description: "",
    athlete_ids: [],
  });

  const [athletes, setAthletes] = useState<AthletesData[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      fetchAthletes();
    }
  }, [open]);

  useEffect(() => {
    if (training) {
      const athleteIds = training.athletes.map((athlete) => athlete.id);

      setFormData({
        title: training.title,
        training_type: training.training_type,
        status: training.status,
        date: training.date,
        duration: training.duration,
        skill_level: training.skill_level,
        description: training.description,
        athlete_ids: athleteIds,
      });
    }
  }, [training, athletes]);

  const fetchAthletes = async () => {
    try {
      const token = localStorage.getItem("access_token")!;
      const athletesData = await getAllAthletes(token);
      setAthletes(athletesData);
    } catch (error) {
      console.error("Ошибка при загрузке спортсменов:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Название тренировки обязательно";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Название должно содержать минимум 2 символа";
    }

    if (!formData.date) {
      newErrors.date = "Дата тренировки обязательна";
    }

    if (formData.duration < 15 || formData.duration > 480) {
      newErrors.duration = "Длительность должна быть от 15 до 480 минут";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описание тренировки обязательно";
    }

    if (formData.athlete_ids.length === 0) {
      newErrors.athlete_ids = "Выберите хотя бы одного спортсмена";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange =
    (field: keyof TrainingFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      const value = event.target.value;

      if (field === "duration") {
        if (value === "") {
          setFormData((prev) => ({
            ...prev,
            [field]: 0,
          }));
        } else {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            setFormData((prev) => ({
              ...prev,
              [field]: numValue,
            }));
          }
        }
      } else if (field === "athlete_ids") {
        setFormData((prev) => ({
          ...prev,
          [field]: value as number[],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value as string,
        }));
      }

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const getAthleteName = (athleteId: number) => {
    const athlete = athletes.find((a) => a.id === athleteId);
    return athlete ? `${athlete.name} (${athlete.sport_type})` : "";
  };

  if (!training) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#ED8936",
          color: "white",
          fontWeight: 600,
          py: 2,
        }}
      >
        Редактировать тренировку
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3, mt: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#2D3748",
              mb: 2,
            }}
          >
            Основная информация
          </Typography>

          <TextField
            fullWidth
            label="Название тренировки *"
            value={formData.title}
            onChange={handleChange("title")}
            error={!!errors.title}
            helperText={errors.title}
            placeholder="Утренняя кардио тренировка"
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Тип тренировки *</InputLabel>
                <Select
                  value={formData.training_type}
                  onChange={handleChange("training_type")}
                  label="Тип тренировки *"
                >
                  <MenuItem value="Индивидуальные">Индивидуальные</MenuItem>
                  <MenuItem value="Групповые">Групповые</MenuItem>
                  <MenuItem value="Силовые">Силовые</MenuItem>
                  <MenuItem value="Кардио">Кардио</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Статус *</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange("status")}
                  label="Статус *"
                >
                  <MenuItem value="Запланированная">Запланированная</MenuItem>
                  <MenuItem value="В процессе">В процессе</MenuItem>
                  <MenuItem value="Завершенная">Завершенная</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#2D3748",
              mb: 2,
            }}
          >
            Детали тренировки
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Дата тренировки *"
                value={formData.date}
                onChange={handleChange("date")}
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Длительность (мин) *"
                value={formData.duration}
                onChange={handleChange("duration")}
                error={!!errors.duration}
                helperText={errors.duration}
                inputProps={{ min: 15, max: 480, step: 15 }}
              />
            </Grid>
          </Grid>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Уровень сложности *</InputLabel>
            <Select
              value={formData.skill_level}
              onChange={handleChange("skill_level")}
              label="Уровень сложности *"
            >
              <MenuItem value="Начальный">Начальный</MenuItem>
              <MenuItem value="Средний">Средний</MenuItem>
              <MenuItem value="Продвинутый">Продвинутый</MenuItem>
              <MenuItem value="Профессиональный">Профессиональный</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#2D3748",
              mb: 2,
            }}
          >
            Участники
          </Typography>

          <FormControl fullWidth error={!!errors.athlete_ids}>
            <InputLabel>Спортсмены *</InputLabel>
            <Select
              multiple
              value={formData.athlete_ids}
              onChange={handleChange("athlete_ids")}
              input={<OutlinedInput label="Спортсмены *" />}
              renderValue={(selected) =>
                selected.map(getAthleteName).join(", ")
              }
              MenuProps={MenuProps}
            >
              {athletes.map((athlete) => (
                <MenuItem key={athlete.id} value={athlete.id}>
                  <Checkbox
                    checked={formData.athlete_ids.indexOf(athlete.id) > -1}
                  />
                  <ListItemText
                    primary={athlete.name}
                    secondary={athlete.sport_type}
                  />
                </MenuItem>
              ))}
            </Select>
            {errors.athlete_ids && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, display: "block" }}
              >
                {errors.athlete_ids}
              </Typography>
            )}
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#2D3748",
              mb: 2,
            }}
          >
            Описание
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Описание тренировки *"
            value={formData.description}
            onChange={handleChange("description")}
            error={!!errors.description}
            helperText={errors.description}
            placeholder="Опишите план тренировки, упражнения, цели..."
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: "#718096",
            mt: 2,
            display: "block",
          }}
        >
          * Обязательные поля
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          gap: 1,
          borderTop: "1px solid #E2E8F0",
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: "#4A5568",
            px: 3,
            py: 1,
          }}
        >
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: "#ED8936",
            fontWeight: 600,
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: "#DD6B20",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {loading ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
