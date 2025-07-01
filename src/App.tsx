import React, { useState } from "react";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
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
import { createAppTheme } from "./theme";

type AppView = 'builder' | 'types';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('builder');

  const theme = createAppTheme(darkMode ? "dark" : "light");

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

      <Box 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: '1400px',
          mx: 'auto',
          minHeight: 'calc(100vh - 140px)'
        }}
      >
        {currentView === 'builder' && (
          <Box>
            <Box 
              sx={{ 
                textAlign: 'center',
                mb: 4,
                p: 3,
                borderRadius: 3,
                background: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? `linear-gradient(135deg, ${theme.palette.background.paper}40 0%, ${theme.palette.primary.dark}20 100%)`
                    : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}10 100%)`,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Build Your Cognitive Stack
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                Drag and drop cognitive functions to build your stack. 
                See real-time matches ordered by best fit.
              </Typography>
            </Box>
            <StackConstructor />
          </Box>
        )}
        
        {currentView === 'types' && <TypeList />}
      </Box>
    </ThemeProvider>
  );
};

export default App;
