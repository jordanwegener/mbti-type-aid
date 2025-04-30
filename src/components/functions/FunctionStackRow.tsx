import React, { useEffect, useCallback } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { FunctionBlock } from "./FunctionBlock";
import {
  horizontalListSortingStrategy,
  SortableContext,
  arrayMove
} from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { CognitiveFunction } from "@domain/function/function";
import { defaultCogFuncs } from "@data/cognitiveFunctions";
import { getStackType } from "@data/stack";

interface CognitiveItem {
  id: string;
  type: CognitiveFunction;
}

export const FunctionStackRow = () => {
  const [stack, setStack] = React.useState<CognitiveItem[]>(defaultCogFuncs);
  const [isAutoMirror, setIsAutoMirror] = React.useState(true);

  // Extract the top 4 functions and convert to a string
  const stackString = stack
    .slice(0, 4)
    .map((f) => f.type)
    .join(",");

  // Get the stack type if the top 4 functions form a valid MBTI stack
  const stackType = getStackType(stackString);

  const mirrorFunctionMap: Record<CognitiveFunction, CognitiveFunction> = {
    [CognitiveFunction.Fi]: CognitiveFunction.Te,
    [CognitiveFunction.Te]: CognitiveFunction.Fi,
    [CognitiveFunction.Fe]: CognitiveFunction.Ti,
    [CognitiveFunction.Ti]: CognitiveFunction.Fe,
    [CognitiveFunction.Ni]: CognitiveFunction.Se,
    [CognitiveFunction.Se]: CognitiveFunction.Ni,
    [CognitiveFunction.Ne]: CognitiveFunction.Si,
    [CognitiveFunction.Si]: CognitiveFunction.Ne
  };

  const labelFor = (index: number): string => {
    switch (index) {
      case 0:
        return "Dominant";
      case 1:
        return "Auxiliary";
      case 2:
        return "Tertiary";
      case 3:
        return "Inferior";
      case 4:
        return "Opposing";
      case 5:
        return "Critical Parent";
      case 6:
        return "Deceiving";
      case 7:
        return "Demonstrative";
      default:
        return "";
    }
  };

  const mirrorLastFourFunctions = useCallback(
    (currentStack: CognitiveItem[]): CognitiveItem[] => {
      const updatedStack = [...currentStack];
      // Mirror each of the first 4 functions to create the shadow functions
      for (let i = 0; i < 4; i++) {
        const functionType = updatedStack[i].type;
        const mirrorType = mirrorFunctionMap[functionType];

        // Find the mirrored function in the remaining stack
        const mirrorIndex = updatedStack.findIndex(
          (f) => f.type === mirrorType
        );

        if (mirrorIndex !== -1) {
          // Move the mirrored function to its correct shadow position
          const [mirroredFunction] = updatedStack.splice(mirrorIndex, 1);
          updatedStack.splice(i + 4, 0, mirroredFunction);
        }
      }
      return updatedStack;
    },
    [mirrorFunctionMap]
  );

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setStack((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newStack = arrayMove(items, oldIndex, newIndex);

      // If auto-mirror is enabled and we moved one of the first 4 functions,
      // automatically update the shadow functions
      if (isAutoMirror && (oldIndex < 4 || newIndex < 4)) {
        return mirrorLastFourFunctions(newStack);
      }

      return newStack;
    });
  };

  // Reset the stack to default
  const handleReset = () => {
    setStack(defaultCogFuncs);
  };

  // Toggle auto-mirroring
  const toggleAutoMirror = () => {
    setIsAutoMirror(!isAutoMirror);
    if (!isAutoMirror) {
      // If we're enabling auto-mirror, immediately mirror the functions
      setStack((current) => mirrorLastFourFunctions(current));
    }
  };

  // Effect to handle initial mirroring and updates when auto-mirror is enabled
  useEffect(() => {
    if (isAutoMirror && stackType) {
      setStack((current) => mirrorLastFourFunctions(current));
    }
  }, [stackType, isAutoMirror, mirrorLastFourFunctions]);

  return (
    <DndContext onDragEnd={onDragEnd}>
      <Stack spacing={2}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={200}
          width="100%"
          flexDirection="row"
        >
          <SortableContext
            items={stack.map((f) => f.id)}
            strategy={horizontalListSortingStrategy}
          >
            {stack.map((f, index) => (
              <Box
                key={f.id}
                flex={1}
                height="100%"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="center"
                sx={{
                  opacity: index < 4 ? 1 : 0.7,
                  transition: "opacity 0.2s"
                }}
              >
                <FunctionBlock
                  index={index}
                  id={f.id}
                  cognitiveFunction={f.type}
                />
                <Typography
                  variant="caption"
                  color={index < 4 ? "primary" : "text.secondary"}
                >
                  {labelFor(index)}
                </Typography>
              </Box>
            ))}
          </SortableContext>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={handleReset} color="primary">
            Reset Stack
          </Button>
          <Button
            variant="outlined"
            onClick={toggleAutoMirror}
            color={isAutoMirror ? "success" : "primary"}
          >
            {isAutoMirror ? "Auto-Mirror On" : "Auto-Mirror Off"}
          </Button>
        </Stack>

        <Typography variant="h4" align="center" marginTop={2}>
          {stackType ? `Type: ${stackType}` : "No valid MBTI type match"}
        </Typography>

        {!stackType && (
          <Typography variant="body2" color="text.secondary" align="center">
            Arrange the top 4 functions to match a valid MBTI type
          </Typography>
        )}
      </Stack>
    </DndContext>
  );
};
