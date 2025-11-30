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
  deleteAthleteById,
  getAllAthletes,
  createAthlete,
  updateAthleteById,
} from "../../api/athletes";
import { Loading } from "../../components/ui/Loading";
import {
  AddAthleteModal,
  EditAthleteModal,
} from "../../components/modals/athletes";
import type { AthletesData, AthleteFormData } from "../../types/types";

export const AthletesPage = () => {
  const [athletes, setAthletes] = useState<AthletesData[] | []>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Все");
  const [sportFilter, setSportFilter] = useState("Все");
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<AthletesData | null>(
    null,
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    try {
      setLoading(true);
      const res = await getAllAthletes(localStorage.getItem("access_token")!);

      if (res) {
        setAthletes(res);
      }
    } catch (error) {
      console.log(error);
      showSnackbar("Ошибка при загрузке спортсменов", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAthlete = async (athleteData: AthleteFormData) => {
    try {
      setLoading(true);
      await createAthlete(localStorage.getItem("access_token")!, athleteData);

      setAddModalOpen(false);
      showSnackbar("Спортсмен успешно добавлен", "success");
      await fetchAthletes();
    } catch (error) {
      console.log(error);
      showSnackbar("Ошибка при добавлении спортсмена", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAthlete = async (athleteData: AthleteFormData) => {
    if (!editingAthlete) return;

    try {
      setLoading(true);
      await updateAthleteById(
        localStorage.getItem("access_token")!,
        editingAthlete.id,
        athleteData,
      );

      setEditModalOpen(false);
      setEditingAthlete(null);
      showSnackbar("Данные спортсмена успешно обновлены", "success");
      await fetchAthletes();
    } catch (error) {
      console.log(error);
      showSnackbar("Ошибка при обновлении данных спортсмена", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteAthleteById(localStorage.getItem("access_token")!, id);
      showSnackbar("Спортсмен успешно удален", "success");
      await fetchAthletes();
    } catch (error) {
      console.log(error);
      showSnackbar("Ошибка при удалении спортсмена", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (athlete: AthletesData) => {
    setEditingAthlete(athlete);
    setEditModalOpen(true);
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

  const filteredAthletes = athletes.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (statusFilter !== "Все") {
      if (statusFilter === "Активные" && a.status !== "Активен") return false;
      if (statusFilter === "С травмами" && a.status !== "Травма") return false;
    }
    if (sportFilter !== "Все" && a.sport_type !== sportFilter) return false;
    return true;
  });

  if (loading && athletes.length === 0) {
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
        sx={{ mb: 3, fontWeight: 700, color: "#2D3748" }}
      >
        Управление спортсменами
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Всего спортсменов", value: athletes.length },
          {
            label: "Активных",
            value: athletes.filter((a) => a.status === "Активен").length,
          },
          {
            label: "С травмами",
            value: athletes.filter((a) => a.status === "Травма").length,
          },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 2,
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Поиск спортсмена..."
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
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Статус"
            >
              <MenuItem value="Все">Все статусы</MenuItem>
              <MenuItem value="Активные">Активные</MenuItem>
              <MenuItem value="С травмами">С травмами</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Вид спорта</InputLabel>
            <Select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              label="Вид спорта"
            >
              <MenuItem value="Все">Все виды спорта</MenuItem>
              <MenuItem value="Плавание">Плавание</MenuItem>
              <MenuItem value="Бег">Бег</MenuItem>
              <MenuItem value="Силовой тренинг">Силовой тренинг</MenuItem>
              <MenuItem value="Йога">Йога</MenuItem>
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
            Добавить спортсмена
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredAthletes.map((a) => (
          <Grid item xs={12} sm={6} md={4} key={a.id}>
            <Card
              sx={{
                borderRadius: 2,
                p: 2,
                borderLeft: `4px solid ${
                  a.status === "Активен" ? "#48BB78" : "#F56565"
                }`,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    mr: 2,
                  }}
                >
                  {a.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{a.name}</Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#4A5568",
                    }}
                  >
                    {a.sport_type}
                  </Typography>
                  <Chip
                    label={a.status === "Активен" ? "Активный" : "Травма"}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 12, color: "#4A5568" }}>
                Возраст: <strong>{a.age}</strong>
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#4A5568" }}>
                Телефон: <strong>{a.phone}</strong>
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  Прогресс за месяц <span>{a.progress}%</span>
                </Typography>
                <Box
                  sx={{
                    height: 6,
                    backgroundColor: "#E2E8F0",
                    borderRadius: 3,
                    mt: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: `${a.progress}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #377CD6, #4FD1C7)",
                      borderRadius: 3,
                    }}
                  ></Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleEditClick(a)}
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
                  onClick={() => handleDelete(a.id)}
                >
                  Удалить
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Модальное окно добавления */}
      <AddAthleteModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddAthlete}
        loading={loading}
      />

      {/* Модальное окно редактирования */}
      <EditAthleteModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingAthlete(null);
        }}
        onSave={handleEditAthlete}
        athlete={editingAthlete}
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
