import React, { useState } from "react";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { StackConstructorDndKit } from "./components/playground/StackConstructorDndKit";

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light"
    },
    typography: {
      fontFamily: "Helvetica, Arial, sans-serif"
    },
  });

  const handleThemeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Cognitive Stack Builder
          </Typography>
          <IconButton color="inherit" onClick={handleThemeToggle}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box display="flex" flexDirection="column" gap={4} width="100%" p={2}>
        <Typography variant="h3" component="h1">
          Build a cognitive stack
        </Typography>
        <StackConstructorDndKit />
      </Box>
    </ThemeProvider>
  );
};

export default App;
