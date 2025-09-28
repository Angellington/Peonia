import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const queryClient = new QueryClient();

import peoniaTheme from "./theme.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={peoniaTheme}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline/>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
