import React from "react";
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
} from "@mui/material";
import type { AthleteFormData } from "../../../types/types";

interface AddAthleteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (athleteData: AthleteFormData) => void;
  loading?: boolean;
}

export const AddAthleteModal: React.FC<AddAthleteModalProps> = ({
  open,
  onClose,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = React.useState<AthleteFormData>({
    name: "",
    status: "Активен",
    sport_type: "Плавание",
    age: 18,
    phone: "",
    progress: 0,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    }

    if (formData.age < 6 || formData.age > 100) {
      newErrors.age = "Возраст должен быть от 6 до 100 лет";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обязателен";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = "Прогресс должен быть от 0 до 100%";
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
    (field: keyof AthleteFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      const value = event.target.value;

      if (field === "age" || field === "progress") {
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

  const handleProgressKeyDown = (event: React.KeyboardEvent) => {
    if (
      !/[\d]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(
        event.key,
      )
    ) {
      event.preventDefault();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      status: "Активен",
      sport_type: "Плавание",
      age: 18,
      phone: "",
      progress: 0,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
          backgroundColor: "#377CD6",
          color: "white",
          fontWeight: 600,
          py: 2,
        }}
      >
        Добавить спортсмена
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
            label="ФИО спортсмена *"
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="Иванов Иван Иванович"
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Статус *</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange("status")}
                  label="Статус *"
                >
                  <MenuItem value="Активен">Активен</MenuItem>
                  <MenuItem value="Травма">Травма</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Вид спорта *</InputLabel>
                <Select
                  value={formData.sport_type}
                  onChange={handleChange("sport_type")}
                  label="Вид спорта *"
                >
                  <MenuItem value="Плавание">Плавание</MenuItem>
                  <MenuItem value="Бег">Бег</MenuItem>
                  <MenuItem value="Силовой тренинг">Силовой тренинг</MenuItem>
                  <MenuItem value="Йога">Йога</MenuItem>
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
            Контактные данные
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Возраст *"
                value={formData.age}
                onChange={handleChange("age")}
                error={!!errors.age}
                helperText={errors.age}
                inputProps={{ min: 6, max: 100 }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Телефон *"
                value={formData.phone}
                onChange={handleChange("phone")}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="+7 (999) 999-99-99"
              />
            </Grid>
          </Grid>
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
            Прогресс
          </Typography>

          <Box sx={{ mb: 1 }}>
            <TextField
              fullWidth
              type="number"
              label="Прогресс за месяц (%)"
              value={formData.progress === 0 ? "" : formData.progress}
              onChange={handleChange("progress")}
              onKeyDown={handleProgressKeyDown}
              error={!!errors.progress}
              helperText={errors.progress}
              inputProps={{
                min: 0,
                max: 100,
                step: 1,
              }}
              sx={{ mb: 1 }}
              placeholder="0"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  height: 8,
                  backgroundColor: "#E2E8F0",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${formData.progress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #377CD6, #4FD1C7)",
                    borderRadius: 4,
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#4A5568",
                minWidth: 40,
                fontWeight: 600,
              }}
            >
              {formData.progress}%
            </Typography>
          </Box>
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
            backgroundColor: "#377CD6",
            fontWeight: 600,
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: "#2B6CB0",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {loading ? "Сохранение..." : "Добавить спортсмена"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
