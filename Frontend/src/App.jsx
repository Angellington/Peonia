import { AppBar, Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import "./App.css";
import Typography from "./components/Typography";
import Button from "./components/Button";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";

import { useState } from "react";

import Posts from "./routes/Posts";
import NewPost from "./routes/NewPost";
import Edit from "./routes/Edit";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentPage, setCurrentPage] = useState(<Posts />);

  return (
    <>
      <BrowserRouter>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="h3">FLORES DE PEÔNIA</Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Button>Home</Button>
                </Link>
                <Link to="/novo" style={{ textDecoration: "none" }}>
                  <Button variant="outlined">Novo</Button>
                </Link>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Box>
          <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/novo" element={<NewPost />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </>
  );
}

export default App;
