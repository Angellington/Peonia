import { AppBar, Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import "./App.css";
import Typography from "./components/Typography";
import Button from "./components/Button";

import { useState } from "react";

import Posts from "./routes/Posts";
import NewPost from "./routes/NewPost";



function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentPage, setCurrentPage] = useState(<Posts />)

  return <>
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
      <Typography variant="h3">
        FLORES DE PEÔNIA
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap", 
        }}
      >
        <Button onClick={() => setCurrentPage(<Posts />)} >Home</Button>
        <Button onClick={() => setCurrentPage(<NewPost />)}  variant="outlined">Novo</Button>
      </Box>
    </Box>
  </Toolbar>
</AppBar>
  <Box>
    {currentPage}
  </Box>
  </>;
}

export default App;
