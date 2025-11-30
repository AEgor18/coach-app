import { Box } from "@mui/material";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../../api/profile";
import { Loading } from "./Loading";

export const Layout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        await getUser(token);
        setAuthChecked(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("access_token");
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }

  if (!authChecked) {
    return null;
  }
  return (
    <Box sx={{ position: "relative" }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          marginLeft: "280px",
          marginTop: "80px",
          padding: 3,
          minHeight: "calc(100vh - 80px)",
          background: "#f5f7fa",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
