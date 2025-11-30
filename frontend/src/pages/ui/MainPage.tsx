import { Box, Typography, Card, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTrainings } from "../../api/trainings";
import type { TrainingsPlan } from "../../types/types";

export const MainPage = () => {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<TrainingsPlan[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token")!;
      const data = await getAllTrainings(token);
      setTrainings(data || []);
    } catch (error) {
      console.error("Ошибка при загрузке тренировок:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMoscowDate = (date: Date): Date => {
    const utcDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
      ),
    );

    const moscowDate = new Date(utcDate.getTime() + 3 * 60 * 60 * 1000);
    return moscowDate;
  };

  const formatToMoscowDateString = (date: Date): string => {
    const moscowDate = getMoscowDate(date);
    return moscowDate.toISOString().split("T")[0];
  };

  const createMoscowDate = (year: number, month: number, day: number): Date => {
    const date = new Date(Date.UTC(year, month, day, 0, 0, 0));
    return new Date(date.getTime() + 3 * 60 * 60 * 1000);
  };

  const getCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = createMoscowDate(year, month, 1);
    const lastDay = createMoscowDate(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();
    const adjustedFirstDayOfWeek =
      firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const daysInMonth = lastDay.getDate();
    const days = [];

    const prevMonthLastDay = createMoscowDate(year, month, 0).getDate();
    for (
      let i = prevMonthLastDay - adjustedFirstDayOfWeek + 1;
      i <= prevMonthLastDay;
      i++
    ) {
      const date = createMoscowDate(year, month - 1, i);
      days.push({
        day: i,
        date: formatToMoscowDateString(date),
        otherMonth: true,
        events: getTrainingsForDate(date),
      });
    }

    const today = getMoscowDate(new Date());
    const todayString = formatToMoscowDateString(today);

    for (let i = 1; i <= daysInMonth; i++) {
      const date = createMoscowDate(year, month, i);
      const dateString = formatToMoscowDateString(date);
      days.push({
        day: i,
        date: dateString,
        current: dateString === todayString,
        events: getTrainingsForDate(date),
      });
    }

    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = createMoscowDate(year, month + 1, i);
      days.push({
        day: i,
        date: formatToMoscowDateString(date),
        otherMonth: true,
        events: getTrainingsForDate(date),
      });
    }

    return days;
  };

  const getTrainingsForDate = (date: Date) => {
    const dateString = formatToMoscowDateString(date);

    return trainings
      .filter((training) => {
        const trainingDate = new Date(training.date + "T00:00:00Z");
        const trainingDateMoscow = getMoscowDate(trainingDate);
        const trainingDateString = formatToMoscowDateString(trainingDateMoscow);

        return trainingDateString === dateString;
      })
      .map((training) => ({
        time: formatTrainingTime(training.duration),
        title: training.title,
        type: training.training_type,
        id: training.id,
      }));
  };

  const formatTrainingTime = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}`;
    }
    return `${minutes} мин`;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getMonthName = (date: Date) => {
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];
    return months[date.getMonth()];
  };

  const getYear = (date: Date) => {
    return date.getFullYear();
  };

  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const calendarDays = getCalendarData();

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#2D3748",
          mb: 3,
          textAlign: "center",
        }}
      >
        Календарь тренировок
      </Typography>

      <Card
        sx={{
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          padding: "30px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#2D3748",
            }}
          >
            {getMonthName(currentDate)} {getYear(currentDate)}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                onClick={() => navigateMonth("prev")}
                sx={{
                  minWidth: "auto",
                  color: "#4A5568",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "#E2E8F0",
                  },
                }}
              >
                ‹
              </Button>
              <Typography sx={{ fontSize: "14px", color: "#2D3748" }}>
                {getMonthName(currentDate)}
              </Typography>
              <Button
                onClick={() => navigateMonth("next")}
                sx={{
                  minWidth: "auto",
                  color: "#4A5568",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "#E2E8F0",
                  },
                }}
              >
                ›
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "1px",
            backgroundColor: "#E2E8F0",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {daysOfWeek.map((day) => (
            <Box
              key={day}
              sx={{
                backgroundColor: "#377CD6",
                color: "white",
                padding: "15px 10px",
                textAlign: "center",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {day}
            </Box>
          ))}

          {calendarDays.map((dayData, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "white",
                padding: "12px 10px",
                minHeight: "100px",
                border: "1px solid #E2E8F0",
                transition: "background-color 0.2s",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#F7FAFC",
                },
                ...(dayData.current && {
                  backgroundColor: "#EBF8FF",
                  border: "2px solid #377CD6",
                }),
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: dayData.otherMonth
                    ? "#A0AEC0"
                    : dayData.current
                      ? "#377CD6"
                      : "#2D3748",
                  ...(dayData.current && { fontWeight: 700 }),
                }}
              >
                {dayData.day}
              </Typography>

              {dayData.events?.map((event, eventIndex) => (
                <Box
                  key={eventIndex}
                  sx={{
                    backgroundColor: getEventColor(event.type),
                    borderLeft: `3px solid ${getEventBorderColor(event.type)}`,
                    padding: "6px 8px",
                    mb: 0.5,
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: getEventHoverColor(event.type),
                      transform: "scale(1.02)",
                    },
                  }}
                  onClick={() => console.log("Training clicked:", event.id)}
                >
                  <Box
                    sx={{
                      fontWeight: 600,
                      color: getEventTextColor(event.type),
                      fontSize: "11px",
                      mb: 0.5,
                    }}
                  >
                    {event.time}
                  </Box>
                  <Box
                    sx={{
                      color: getEventTextColor(event.type),
                      fontSize: "11px",
                      lineHeight: 1.2,
                    }}
                  >
                    {event.title}
                  </Box>
                  <Box
                    sx={{
                      color: getEventTypeColor(event.type),
                      fontSize: "10px",
                      fontWeight: 600,
                      mt: 0.5,
                    }}
                  >
                    {event.type}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
};

const getEventColor = (type: string) => {
  switch (type) {
    case "Индивидуальные":
      return "#EBF8FF";
    case "Групповые":
      return "#F0FFF4";
    case "Силовые":
      return "#FFF5F5";
    case "Кардио":
      return "#FAF5FF";
    default:
      return "#EDF2F7";
  }
};

const getEventBorderColor = (type: string) => {
  switch (type) {
    case "Индивидуальные":
      return "#3182CE";
    case "Групповые":
      return "#38A169";
    case "Силовые":
      return "#E53E3E";
    case "Кардио":
      return "#805AD5";
    default:
      return "#4A5568";
  }
};

const getEventHoverColor = (type: string) => {
  switch (type) {
    case "Индивидуальные":
      return "#BEE3F8";
    case "Групповые":
      return "#C6F6D5";
    case "Силовые":
      return "#FED7D7";
    case "Кардио":
      return "#E9D8FD";
    default:
      return "#E2E8F0";
  }
};

const getEventTextColor = (type: string) => {
  switch (type) {
    case "Индивидуальные":
      return "#2C5282";
    case "Групповые":
      return "#276749";
    case "Силовые":
      return "#C53030";
    case "Кардио":
      return "#553C9A";
    default:
      return "#2D3748";
  }
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "Индивидуальные":
      return "#3182CE";
    case "Групповые":
      return "#38A169";
    case "Силовые":
      return "#E53E3E";
    case "Кардио":
      return "#805AD5";
    default:
      return "#4A5568";
  }
};
