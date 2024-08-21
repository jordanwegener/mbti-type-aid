import React from "react";
import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import {
  CognitiveFunction,
  CognitiveFunctionInfo
} from "@domain/function/function";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface FunctionProps {
  id: string;
  index: number;
  cognitiveFunction: CognitiveFunction;
}

export const FunctionBlock: React.FC<FunctionProps> = ({
  id,
  index,
  cognitiveFunction
}: FunctionProps) => {
  const text = cognitiveFunction.toString();
  const toolTipText = CognitiveFunctionInfo[cognitiveFunction].description;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: index > 3 ? 0.5 : 1,  // Dim if index > 3
  };

  return (
    <Box
      ref={setNodeRef}
      width={80}
      padding={1}
      margin={1}
      border={2}
      borderRadius={2}
      boxShadow={2}
      {...attributes}
      {...listeners}
      style={style}
    >
      <Tooltip title={toolTipText} arrow enterDelay={500}>
        <Typography variant="h6">{text}</Typography>
      </Tooltip>
    </Box>
  );
};
