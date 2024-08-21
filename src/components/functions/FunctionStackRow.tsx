import React from "react";
import { Box, Typography } from "@mui/material";
import { FunctionBlock } from "./FunctionBlock";
import {
  horizontalListSortingStrategy,
  SortableContext,
  arrayMove
} from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { CognitiveFunction } from "@domain/function/function";
import { defaultCogFuncs } from "@data/cognitiveFunctions";

export const FunctionStackRow = () => {
  const [topRow, setTopRow] = React.useState(defaultCogFuncs);

  const mirrorFunctionMap = {
    Fi: "Ti",
    Ti: "Fi",
    Fe: "Te",
    Te: "Fe",
    Ni: "Si",
    Si: "Ni",
    Ne: "Se",
    Se: "Ne"
  };

  const labelFor = (index) => {
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

  const swapConflictingFunction = (stack, newIndex) => {
    let updatedStack = [...stack];
    const newFunction = updatedStack[newIndex];
    const mirrorFunctionType = mirrorFunctionMap[newFunction.type];

    // Check if there's a conflict in the first four positions
    const conflictIndex = updatedStack.slice(0, 4).findIndex(
      (item) => item.type === mirrorFunctionType
    );

    if (conflictIndex !== -1) {
      // Swap the conflicting function with the one being dragged
      [updatedStack[conflictIndex], updatedStack[newIndex]] = [updatedStack[newIndex], updatedStack[conflictIndex]];
    }

    return updatedStack;
  };

  const onDragEnd = ({ active, over }) => {
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      setTopRow((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Move the dragged function to its new position
        let newStack = arrayMove(items, oldIndex, newIndex);

        // Ensure that if a conflicting function is dragged into the top 4,
        // it swaps with its counterpart.
        if (newIndex < 4) {
          newStack = swapConflictingFunction(newStack, newIndex);
        }

        return newStack;
      });
    }
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={200}
        width="100%"
        borderRadius={1}
        flexDirection="row"
      >
        <SortableContext
          items={topRow.map((f) => f.id)}
          strategy={horizontalListSortingStrategy}
        >
          {topRow.map((f, index) => (
            <Box
              key={f.id}  // Move key to the outer Box to avoid React key issues
              flex={1}
              height={"100%"}
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <FunctionBlock
                id={f.id}
                cognitiveFunction={f.type as CognitiveFunction}
              />
              <Typography variant="caption" color="gray">
                {labelFor(index)}
              </Typography>
            </Box>
          ))}
        </SortableContext>
      </Box>
    </DndContext>
  );
};
