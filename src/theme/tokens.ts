export const designTokens = {
  colors: {
    light: {
      primary: {
        main: "#4f46e5",
        light: "#7c3aed", 
        dark: "#3730a3"
      },
      secondary: {
        main: "#0891b2",
        light: "#0ea5e9",
        dark: "#0c4a6e"
      },
      background: {
        default: "#f8fafc",
        paper: "#ffffff"
      },
      divider: "rgba(0, 0, 0, 0.06)"
    },
    dark: {
      primary: {
        main: "#6366f1",
        light: "#8b5cf6",
        dark: "#4338ca"
      },
      secondary: {
        main: "#06b6d4", 
        light: "#22d3ee",
        dark: "#0e7490"
      },
      background: {
        default: "#0f0f23",
        paper: "#1e1e3f"
      },
      divider: "rgba(255, 255, 255, 0.1)"
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24
  },
  shadows: {
    light: [
      'none',
      '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    ],
    dark: [
      'none',
      '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
      '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
      '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    ]
  },
  transitions: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
    slow: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    weights: {
      regular: 400,
      medium: 500, 
      semibold: 600,
      bold: 700
    },
    letterSpacing: {
      tight: "-0.025em",
      normal: "-0.015em",
      relaxed: "-0.01em"
    }
  },
  slots: {
    width: 160,
    height: 120,
    spacing: 16,
    hoverScale: 1.05,
    // Calculate container width: (4 slots × width) + (3 gaps × spacing) + (extra space for hover scale)
    get containerWidth() {
      const scaledWidth = this.width * this.hoverScale;
      const extraSpace = (scaledWidth - this.width) * 2; // Buffer for rightmost slot
      return (this.width * 4) + (this.spacing * 3) + extraSpace;
    }
  },
  functionPool: {
    functionWidth: 88,
    totalFunctions: 8,
    spacing: 16,
    hoverScale: 1.02,
    minRowHeight: 120,
    // Calculate width for single row of all 8 functions (desktop)
    get containerWidth() {
      // Calculate for all 8 functions in one row
      const allFunctionsWidth = (this.functionWidth * this.totalFunctions) + (this.spacing * (this.totalFunctions - 1));
      const padding = 48; // Container padding
      const hoverBuffer = 32; // Buffer for hover effects
      return allFunctionsWidth + padding + hoverBuffer; // ~896px for single row
    },
    // Calculate width for 2 rows of 4 functions (mobile)
    get mobileContainerWidth() {
      // Calculate for 4 functions per row
      const functionsPerRow = 4;
      const rowWidth = (this.functionWidth * functionsPerRow) + (this.spacing * (functionsPerRow - 1));
      const padding = 48; // Container padding
      const hoverBuffer = 32; // Buffer for hover effects
      return rowWidth + padding + hoverBuffer; // ~480px for 2x4 layout
    }
  }
} as const;