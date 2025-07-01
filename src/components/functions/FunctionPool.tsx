import React from "react";
import { Typography, Paper, Box, Button } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDroppable } from "@dnd-kit/core";
import { CognitiveFunction } from "@domain/function/function";
import { FunctionBlock } from "./FunctionBlock";
import { getDisabledReason } from "@utils/disabledReasons";

interface FunctionPoolProps {
  availableFunctions: Array<{
    id: string;
    type: CognitiveFunction;
  }>;
  onReset: () => void;
  disabledFunctions?: Set<CognitiveFunction>;
  currentStack?: (CognitiveFunction | null)[];
}

export const FunctionPool: React.FC<FunctionPoolProps> = ({ 
  availableFunctions,
  onReset,
  disabledFunctions = new Set(),
  currentStack = [null, null, null, null]
}) => {
  const { setNodeRef } = useDroppable({
    id: "function-pool"
  });

  return (
    <Box>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={2}
      >
        <Typography variant="h6">
          Available Functions
        </Typography>
        <Button
          variant="outlined"
          onClick={onReset}
          startIcon={<RefreshIcon />}
          size="small"
          color="secondary"
        >
          Reset Stack
        </Button>
      </Box>
      <Paper 
        ref={setNodeRef}
        sx={{
          p: 2,
          backgroundColor: "background.default",
          border: "2px dashed",
          borderColor: "divider",
          minHeight: 100,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {availableFunctions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Drop functions here to return them to the pool
          </Typography>
        ) : (
          availableFunctions.map((func) => {
            const isDisabled = disabledFunctions.has(func.type);
            const disabledReason = isDisabled ? getDisabledReason(currentStack, func.type) : undefined;
            
            return (
              <FunctionBlock
                key={func.id}
                id={func.id}
                cognitiveFunction={func.type}
                disabled={isDisabled}
                disabledReason={disabledReason}
              />
            );
          })
        )}
      </Paper>
    </Box>
  );
};
