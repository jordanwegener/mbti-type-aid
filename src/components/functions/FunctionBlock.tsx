import React from "react";
import { Paper, Typography, Tooltip } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CognitiveFunction, CognitiveFunctionInfo } from "../../domain/function/function";

interface FunctionBlockProps {
  id: string;
  cognitiveFunction: CognitiveFunction;
  disabled?: boolean;
}

export const FunctionBlock: React.FC<FunctionBlockProps> = ({ 
  id, 
  cognitiveFunction,
  disabled = false 
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
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? "default" : "grab"
  };

  const functionInfo = CognitiveFunctionInfo[cognitiveFunction];

  return (
    <Tooltip 
      title={
        <div>
          <Typography variant="subtitle2" gutterBottom>
            {functionInfo.name}
          </Typography>
          <Typography variant="body2">
            {functionInfo.description}
          </Typography>
        </div>
      }
      enterDelay={2000}
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
          ...style
        }}
      >
        <Typography variant="h6">{cognitiveFunction}</Typography>
      </Paper>
    </Tooltip>
  );
};
