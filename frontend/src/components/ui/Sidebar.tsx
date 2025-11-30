import {
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { sidebarPages } from "../../constants";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../../api/profile";

export function Sidebar() {
  const location = useLocation();

  const [user, setUser] = useState({});
  const [showName, setShowName] = useState();
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("access_token")!;
    const res = await getUser(token);

    if (res) {
      setUser(res);
      formatFullName(res.full_name);
    }
  };

  const formatFullName = (fullName) => {
    const showName = fullName.split(" ");
    if (showName.length === 1) {
      setShowName(showName[0].slice(0, 1).toUpperCase());
    } else {
      const name =
        showName[0].slice(0, 1).toUpperCase() +
        showName[1].slice(0, 1).toUpperCase();
      setShowName(name);
    }
  };

  return (
    <Box
      sx={{
        width: 280,
        backgroundColor: "#dae4f7",
        height: "calc(100vh - 80px)",
        position: "fixed",
        overflowY: "auto",
        padding: "30px 20px",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            backgroundColor: "white",
            color: "#377CD6",
            border: "3px solid white",
            fontSize: "32px",
            margin: "0 auto 15px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          {showName}
        </Avatar>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#2D3748",
            marginBottom: "5px",
          }}
        >
          {user.full_name}
        </Typography>
        <Typography
          sx={{
            color: "#4A5568",
            fontSize: "14px",
          }}
        >
          Профессиональный тренер
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {sidebarPages.map((item) => {
          const isActive = location.pathname === item.link;

          return (
            <ListItem key={item.name} sx={{ p: 0, mb: 1, fontWeight: 600 }}>
              <ListItemButton
                component={Link}
                to={item.link}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  fontWeight: 600,
                  textDecoration: "none",
                  ...(isActive && {
                    backgroundColor: "white",
                    color: "#377CD6",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }),
                  ...(!isActive && {
                    color: "#2D3748",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      transform: "translateX(5px)",
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    marginRight: "12px",
                    ...(isActive && {
                      color: "#377CD6",
                    }),
                    ...(!isActive && {
                      color: "#2D3748",
                    }),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: 600,
                      fontSize: "14px",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
