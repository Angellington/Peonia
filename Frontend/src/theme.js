// themeDark.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#d16ba5", // rosa peônia
      light: "#f1a7c7",
      dark: "#9a4d78",
      contrastText: "#fff",
    },
    secondary: {
      main: "#86a8e7", // azul lavanda
      light: "#b5cfff",
      dark: "#5473b7",
      contrastText: "#fff",
    },
    background: {
      default: "#1a1a1a", // fundo escuro
      paper: "#2a2a2a",   // cards, menus, etc.
    },
    text: {
      primary: "#f5f5f5", // texto principal claro
      secondary: "#cfcfcf", // texto secundário
    },
  },

  typography: {
    fontFamily: '"Josefin Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "2.5rem", fontWeight: 700, color: "#f1a7c7" },
    h2: { fontSize: "2rem", fontWeight: 600, color: "#f1a7c7" },
    h3: { fontSize: "1.75rem", fontWeight: 600, color: "#d16ba5" },
    body1: { fontSize: "1rem", lineHeight: 1.6, color: "#f5f5f5" },
    body2: { fontSize: "0.9rem", lineHeight: 1.5, color: "#cfcfcf" },
    button: { textTransform: "none", fontWeight: 600 },
  },

  spacing: 8, 

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  shape: {
    borderRadius: 12,
  },
});

export default theme;
