import React from "react";
import { Paper, Typography, Tooltip } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CognitiveFunction, CognitiveFunctionInfo } from "../../domain/function/function";
import { designTokens } from "../../theme";
import { useAdaptiveTooltip } from "../../hooks/useAdaptiveTooltip";

interface FunctionBlockProps {
  id: string;
  cognitiveFunction: CognitiveFunction;
  disabled?: boolean;
  disabledReason?: string;
}

export const FunctionBlock: React.FC<FunctionBlockProps> = ({ 
  id, 
  cognitiveFunction,
  disabled = false,
  disabledReason 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id,
    disabled: disabled // This should prevent drag start for disabled items
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "grab"
  };

  const functionInfo = CognitiveFunctionInfo[cognitiveFunction];

  const tooltipContent = disabled && disabledReason ? (
    <div>
      <Typography variant="subtitle2" gutterBottom color="error">
        Cannot place {cognitiveFunction}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {disabledReason}
      </Typography>
      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
        {functionInfo.name}
      </Typography>
    </div>
  ) : (
    <div>
      <Typography variant="subtitle2" gutterBottom>
        {functionInfo.name}
      </Typography>
      <Typography variant="body2">
        {functionInfo.description}
      </Typography>
    </div>
  );

  const adaptiveTooltip = useAdaptiveTooltip({
    hoverDelay: disabled ? 1000 : 2000,
    longPressDelay: 800,
    disabled: false
  });

  return (
    <Tooltip 
      title={tooltipContent}
      open={adaptiveTooltip.isOpen}
      placement="top"
      arrow
      onClose={adaptiveTooltip.close}
    >
      <Paper
        ref={setNodeRef}
        {...attributes}
        {...(disabled ? {} : listeners)}
        {...adaptiveTooltip.targetProps}
        elevation={disabled ? 1 : 3}
        sx={{
          p: designTokens.spacing.md / 8,
          backgroundColor: disabled ? "action.disabledBackground" : "background.paper",
          minWidth: 88,
          textAlign: "center",
          userSelect: "none",
          borderRadius: designTokens.borderRadius.lg / 8,
          border: disabled ? "2px solid" : "1px solid",
          borderColor: disabled ? "error.main" : "divider",
          background: disabled ? undefined : (theme) => 
            theme.palette.mode === 'dark' 
              ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`
              : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': disabled ? {} : {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            opacity: 0,
            transition: `opacity ${designTokens.transitions.slow}`
          },
          '&:hover': disabled ? {
            borderColor: 'error.main',
            backgroundColor: 'error.light',
            transform: 'scale(0.98)'
          } : {
            elevation: 6,
            transform: `translateY(-2px) scale(${designTokens.functionPool.hoverScale})`,
            borderColor: 'primary.main',
            '&::before': {
              opacity: 1
            }
          },
          '&:active': disabled ? {} : {
            transform: 'translateY(0px) scale(1)',
          },
          transition: designTokens.transitions.normal,
          ...style
        }}
      >
        <Typography variant="h6">{cognitiveFunction}</Typography>
      </Paper>
    </Tooltip>
  );
};
