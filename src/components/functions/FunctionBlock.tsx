import React from "react";
import { Paper, Typography, Tooltip } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CognitiveFunction, CognitiveFunctionInfo } from "../../domain/function/function";

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
    disabled 
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

  return (
    <Tooltip 
      title={tooltipContent}
      enterDelay={disabled ? 1000 : 2000}
      placement="top"
      arrow
    >
      <Paper
        ref={setNodeRef}
        {...attributes}
        {...(disabled ? {} : listeners)}
        elevation={2}
        sx={{
          p: 2,
          backgroundColor: disabled ? "action.disabledBackground" : "background.paper",
          minWidth: 80,
          textAlign: "center",
          userSelect: "none",
          border: disabled ? "2px solid transparent" : "none",
          '&:hover': disabled ? {
            borderColor: 'error.main',
            backgroundColor: 'error.light'
          } : {},
          ...style
        }}
      >
        <Typography variant="h6">{cognitiveFunction}</Typography>
      </Paper>
    </Tooltip>
  );
};
