import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import {
  CognitiveFunction,
  CognitiveFunctionInfo
} from "../../domain/function/function";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface FunctionProps {
  id: string;
  cognitiveFunction: CognitiveFunction;
}

export const FunctionBlock: React.FC<FunctionProps> = ({
  id,
  cognitiveFunction
}: FunctionProps) => {
  const text = cognitiveFunction.toString();
  const toolTipText = CognitiveFunctionInfo[cognitiveFunction].description;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  return (
    <Box
      ref={setNodeRef}
      width={80}
      color="blue"
      padding={1}
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
