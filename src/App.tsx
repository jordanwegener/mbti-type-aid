import React, { useState } from "react";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Stack,
  Tabs,
  Tab
} from "@mui/material";
import { Brightness4, Brightness7, Build, List } from "@mui/icons-material";
import { StackConstructor } from "./components/playground/StackConstructor";
import { TypeList } from "./components/types/TypeList";

type AppView = 'builder' | 'types';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('builder');

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

  const handleViewChange = (_: React.SyntheticEvent, newValue: AppView) => {
    setCurrentView(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            MBTI Type Aid
          </Typography>
          <IconButton color="inherit" onClick={handleThemeToggle}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentView} onChange={handleViewChange} centered>
          <Tab 
            icon={<Build />} 
            label="Stack Builder" 
            value="builder"
            iconPosition="start"
          />
          <Tab 
            icon={<List />} 
            label="Browse Types" 
            value="types"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <Box p={3}>
        {currentView === 'builder' && (
          <Box>
            <Typography variant="h5" component="h1" gutterBottom>
              Build Your Cognitive Stack
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Drag and drop cognitive functions to build your stack. 
              See real-time matches ordered by best fit.
            </Typography>
            <StackConstructor />
          </Box>
        )}
        
        {currentView === 'types' && <TypeList />}
      </Box>
    </ThemeProvider>
  );
};

export default App;
