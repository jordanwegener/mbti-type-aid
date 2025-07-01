import { createTheme } from '@mui/material/styles';
import { designTokens } from './tokens';
import { createComponentOverrides } from './components';

export const createAppTheme = (mode: 'light' | 'dark') => {
  const colors = mode === 'dark' ? designTokens.colors.dark : designTokens.colors.light;
  const shadows = mode === 'dark' ? designTokens.shadows.dark : designTokens.shadows.light;
  
  // Extend shadows array to 25 elements as required by MUI
  const extendedShadows = [
    ...shadows,
    ...Array(25 - shadows.length).fill(shadows[shadows.length - 1])
  ];

  return createTheme({
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      divider: colors.divider
    },
    typography: {
      fontFamily: designTokens.typography.fontFamily,
      h4: {
        fontWeight: designTokens.typography.weights.bold,
        letterSpacing: designTokens.typography.letterSpacing.tight
      },
      h5: {
        fontWeight: designTokens.typography.weights.semibold,
        letterSpacing: designTokens.typography.letterSpacing.normal
      },
      h6: {
        fontWeight: designTokens.typography.weights.semibold,
        letterSpacing: designTokens.typography.letterSpacing.relaxed
      }
    },
    shape: {
      borderRadius: designTokens.borderRadius.lg
    },
    shadows: extendedShadows as any,
    components: createComponentOverrides(mode)
  });
};