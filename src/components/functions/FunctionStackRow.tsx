import React, { useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
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

export const FunctionStackRow = () => {
  const [topRow, setTopRow] = React.useState(defaultCogFuncs);

  // Extract the top 4 functions and convert to a string
  const stackString = topRow
    .slice(0, 4)
    .map((f) => f.type)
    .join(",");

  // Get the stack type if the top 4 functions form a valid MBTI stack
  const stackType = getStackType(stackString);

  const mirrorFunctionMap = {
    Fi: "Te",
    Te: "Fi",
    Fe: "Ti",
    Ti: "Fe",
    Ni: "Se",
    Se: "Ni",
    Ne: "Si",
    Si: "Ne"
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

  const mirrorLastFourFunctions = (stack) => {
    const updatedStack = [...stack];
    for (let i = 0; i < 4; i++) {
      const functionType = updatedStack[i].type;
      const mirrorType = mirrorFunctionMap[functionType];
      const mirrorIndex = updatedStack.findIndex((f) => f.type === mirrorType);

      // Move the mirrored function to its correct position
      const [mirroredFunction] = updatedStack.splice(mirrorIndex, 1);
      updatedStack.splice(i + 4, 0, mirroredFunction);
    }
    return updatedStack;
  };

  const onDragEnd = ({ active, over }) => {
    if (!over) return;

    if (active.id !== over.id) {
      setTopRow((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        let newStack = arrayMove(items, oldIndex, newIndex);

        return newStack;
      });
    }
  };

  // useEffect(() => {
  //   if(stackType) {
  //     setTopRow(mirrorLastFourFunctions(topRow));
  //   }
  // }, [stackType]);

  return (
    <DndContext onDragEnd={onDragEnd}>
      <Stack spacing={1}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={200}
          width="100%"
          flexDirection="row"
        >
          <SortableContext
            items={topRow.map((f) => f.id)}
            strategy={horizontalListSortingStrategy}
          >
            {topRow.map((f, index) => (
              <Box
                key={f.id}
                flex={1}
                height="100%"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="center"
              >
                <FunctionBlock
                  index={index}
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
        <Typography variant="h2" align="center" marginTop={2}>
          {stackType ?? "No match for any MBTI type :("}
        </Typography>
        <Typography variant="caption" align="center">
          Right now this is a bit crappy and broken.
        </Typography>
        <Typography variant="caption" align="center">
          The last 4 functions don't get sorted automatically so they should not
          be considered part of the stack.
        </Typography>
      </Stack>
    </DndContext>
  );
};
