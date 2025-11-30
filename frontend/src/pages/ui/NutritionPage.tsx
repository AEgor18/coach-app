import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  deleteNutritionById,
  getAllNutritions,
  createNutrition,
  updateNutritionById,
} from "../../api/nutrition";
import { Loading } from "../../components/ui/Loading";
import type { NutritionPlan, NutritionFormData } from "../../types/types";
import {
  AddNutritionModal,
  EditNutritionModal,
} from "../../components/modals/nutrition";

export const NutritionPage: React.FC = () => {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "Все статусы" | "Активен" | "Завершен"
  >("Все статусы");
  const [typeFilter, setTypeFilter] = useState("Все типы");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await getAllNutritions(localStorage.getItem("access_token")!);

      if (res) {
        setPlans(res);
      }
    } catch (error) {
      console.log(error);
      showSnackbar("Ошибка при загрузке планов питания", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNutrition = async (nutritionData: NutritionFormData) => {
    try {
      setLoading(true);
      await createNutrition(
        localStorage.getItem("access_token")!,
        nutritionData,
      );
      setAddModalOpen(false);
      showSnackbar("План питания успешно создан", "success");
      await fetchPlans();
    } catch (error) {
      console.log(error);
      showSnackbar("Ошибка при создании плана питания", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditNutrition = async (nutritionData: NutritionFormData) => {
    if (!selectedPlan) return;

    try {
      setLoading(true);
      await updateNutritionById(
        localStorage.getItem("access_token")!,
        selectedPlan.id,
        nutritionData,
      );
      setEditModalOpen(false);
      setSelectedPlan(null);
      showSnackbar("План питания успешно обновлен", "success");
      await fetchPlans();
    } catch (error) {
      console.log(error);
      showSnackbar("Ошибка при обновлении плана питания", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (plan: NutritionPlan) => {
    setSelectedPlan(plan);
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setSelectedPlan(null);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteNutritionById(localStorage.getItem("access_token")!, id);
      showSnackbar("План питания успешно удален", "success");
      await fetchPlans();
    } catch (error) {
      console.log(error);
      showSnackbar("Ошибка при удалении плана питания", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const visiblePlans = plans.filter((plan) => {
    const q = search.trim().toLowerCase();
    if (
      q &&
      !`${plan.title} ${plan.description} ${plan.athletes
        .map((a) => a.name)
        .join(" ")}`
        .toLowerCase()
        .includes(q)
    )
      return false;
    if (statusFilter !== "Все статусы" && plan.status !== statusFilter)
      return false;
    if (typeFilter !== "Все типы" && plan.nutrition_type !== typeFilter)
      return false;
    return true;
  });

  if (loading && plans.length === 0) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#F7FAFC",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "#2D3748", mb: 3 }}
      >
        Управление питанием
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Всего планов", value: plans.length },
          {
            label: "Активных",
            value: plans.filter((p) => p.status === "Активен").length,
          },
          {
            label: "Завершено",
            value: plans.filter((p) => p.status === "Завершен").length,
          },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 2,
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-3px)" },
              }}
            >
              <Typography
                sx={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#377CD6",
                  mb: 1,
                }}
              >
                {stat.value}
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#4A5568" }}>
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        <TextField
          placeholder="Поиск плана питания..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: 200,
            backgroundColor: "#E2E8F0",
            borderRadius: 1,
            flex: 1,
            background: "#fff",
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Статус"
          >
            <MenuItem value="Все статусы">Все статусы</MenuItem>
            <MenuItem value="Активен">Активные</MenuItem>
            <MenuItem value="Завершен">Завершенные</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Тип</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            label="Тип"
          >
            <MenuItem value="Все типы">Все типы</MenuItem>
            <MenuItem value="набор массы">Набор массы</MenuItem>
            <MenuItem value="снижение веса">Снижение веса</MenuItem>
            <MenuItem value="поддержание">Поддержание</MenuItem>
            <MenuItem value="восстановление">Восстановление</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => setAddModalOpen(true)}
          sx={{
            backgroundColor: "#377CD6",
            fontWeight: 600,
            fontSize: "14px",
            "&:hover": {
              backgroundColor: "#2B6CB0",
              transform: "translateY(-1px)",
              boxShadow: "0 6px 12px rgba(55, 124, 214, 0.3)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Создать план
        </Button>
      </Box>

      <Grid container spacing={2}>
        {visiblePlans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card
              sx={{
                borderRadius: 2,
                p: 2,
                borderLeft: `4px solid ${
                  plan.nutrition_type === "набор массы"
                    ? "#F56565"
                    : plan.nutrition_type === "снижение веса"
                      ? "#48BB78"
                      : plan.nutrition_type === "поддержание"
                        ? "#ED8936"
                        : "#377CD6"
                }`,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
                minWidth: 400,
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#2D3748",
                  mb: 0.5,
                }}
              >
                {plan.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  color: "#4A5568",
                  mb: 1,
                }}
              >
                {plan.nutrition_type}
              </Typography>

              <Chip
                label={plan.status}
                size="small"
                sx={{
                  backgroundColor:
                    plan.status === "Активен" ? "#C6F6D5" : "#BEE3F8",
                  color: plan.status === "Активен" ? "#22543D" : "#2A4365",
                  fontWeight: 600,
                  borderRadius: "16px",
                  mb: 1.5,
                  fontSize: 11,
                }}
              />

              <Box sx={{ mb: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#4A5568",
                  }}
                >
                  Калорийность:{" "}
                  <Box component="span" sx={{ color: "#2D3748" }}>
                    {plan.calories} ккал
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#4A5568",
                  }}
                >
                  Б/Ж/У:{" "}
                  <Box component="span" sx={{ color: "#2D3748" }}>
                    {plan.protein}/{plan.fats}/{plan.carbs} г
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#4A5568",
                  }}
                >
                  Период:{" "}
                  <Box component="span" sx={{ color: "#2D3748" }}>
                    {plan.period_weeks} недель
                  </Box>
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#2D3748",
                  backgroundColor: "#E2E8F0",
                  borderRadius: 1,
                  p: 1,
                  mb: 1.5,
                }}
              >
                {plan.description}
              </Typography>

              <Box sx={{ mb: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#4A5568",
                    mb: 0.5,
                  }}
                >
                  Пример рациона:
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    backgroundColor: "#F7FAFC",
                    borderRadius: 1,
                    p: 0.7,
                    mb: 0.5,
                  }}
                >
                  <strong>Завтрак:</strong> {plan.breakfast}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    backgroundColor: "#F7FAFC",
                    borderRadius: 1,
                    p: 0.7,
                    mb: 0.5,
                  }}
                >
                  <strong>Обед:</strong> {plan.lunch}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    backgroundColor: "#F7FAFC",
                    borderRadius: 1,
                    p: 0.7,
                    mb: 0.5,
                  }}
                >
                  <strong>Ужин:</strong> {plan.dinner}
                </Typography>
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#4A5568",
                    mb: 0.5,
                  }}
                >
                  Спортсмены:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    flexWrap: "wrap",
                  }}
                >
                  {plan.athletes.map((a) => (
                    <Chip
                      key={a.id}
                      size="small"
                      label={a.name}
                      sx={{
                        fontSize: 11,
                        backgroundColor: "#E2E8F0",
                        color: "#2D3748",
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor: "#377CD6",
                    "&:hover": {
                      backgroundColor: "#2B6CB0",
                      transform: "translateY(-1px)",
                      transition: "0.3s ease-in-out",
                    },
                  }}
                  onClick={() => handleOpenEdit(plan)}
                >
                  Редактировать
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor: "#F56565",
                    "&:hover": {
                      backgroundColor: "#C53030",
                      transform: "translateY(-1px)",
                      transition: "0.3s ease-in-out",
                    },
                  }}
                  onClick={() => handleDelete(plan.id)}
                >
                  Удалить
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Модальное окно добавления */}
      <AddNutritionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddNutrition}
        loading={loading}
      />

      {/* Модальное окно редактирования */}
      <EditNutritionModal
        open={editModalOpen}
        onClose={handleCloseEdit}
        onSave={handleEditNutrition}
        nutrition={selectedPlan}
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
