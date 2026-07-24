import { Components, Theme } from '@mui/material/styles';
import { designTokens } from './tokens';

export const createComponentOverrides = (mode: 'light' | 'dark'): Components<Theme> => ({
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        transition: designTokens.transitions.normal,
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: designTokens.borderRadius.xl,
        transition: designTokens.transitions.slow,
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: designTokens.borderRadius.md,
        textTransform: 'none',
        fontWeight: designTokens.typography.weights.semibold,
        transition: designTokens.transitions.normal,
        padding: '10px 20px',
        '&:hover': {
          transform: 'translateY(-1px)',
        }
      },
      contained: {
        boxShadow: mode === 'dark' 
          ? designTokens.shadows.dark[3]
          : designTokens.shadows.light[3],
        '&:hover': {
          boxShadow: mode === 'dark'
            ? designTokens.shadows.dark[4] 
            : designTokens.shadows.light[4],
          transform: 'translateY(-1px)',
        }
      }
    }
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: designTokens.borderRadius.md,
        fontWeight: designTokens.typography.weights.medium,
        transition: designTokens.transitions.fast,
        '&:hover': {
          transform: 'scale(1.05)',
        }
      }
    }
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        '& .MuiTabs-indicator': {
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: mode === 'dark'
            ? `linear-gradient(90deg, ${designTokens.colors.dark.primary.main}, ${designTokens.colors.dark.secondary.main})`
            : `linear-gradient(90deg, ${designTokens.colors.light.primary.main}, ${designTokens.colors.light.secondary.main})`
        }
      }
    }
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: designTokens.typography.weights.medium,
        borderRadius: `${designTokens.borderRadius.sm}px ${designTokens.borderRadius.sm}px 0 0`,
        transition: designTokens.transitions.normal,
        '&:hover': {
          backgroundColor: mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.04)'
            : 'rgba(0, 0, 0, 0.04)',
        }
      }
    }
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        background: mode === 'dark'
          ? `linear-gradient(135deg, ${designTokens.colors.dark.background.paper} 0%, ${designTokens.colors.dark.primary.dark} 100%)`
          : `linear-gradient(135deg, ${designTokens.colors.light.background.paper} 0%, ${designTokens.colors.light.primary.main} 100%)`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${mode === 'dark' ? designTokens.colors.dark.divider : designTokens.colors.light.divider}`,
      }
    }
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: designTokens.transitions.fast,
        '&:hover': {
          transform: 'scale(1.1)',
        }
      }
    }
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: designTokens.borderRadius.sm,
        height: 8,
      }
    }
  }
});