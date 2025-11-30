import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { CssBaseline } from "@mui/material";
import { Router } from "./Route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <Router />
    </QueryClientProvider>
  </StrictMode>,
);
