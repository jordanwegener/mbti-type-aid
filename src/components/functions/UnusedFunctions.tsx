import React from "react";
import { Box } from "@mui/material";
import { FunctionBlock } from "./FunctionBlock";
import {
  horizontalListSortingStrategy,
  SortableContext,
  arrayMove
} from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { CognitiveFunction } from "@domain/function/function";
import { defaultCogFuncs } from "@data/cognitiveFunctions";

export const UnusedFunctions = () => {
  const [topRow, setTopRow] = React.useState(defaultCogFuncs);

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      setTopRow((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={200}
      width="100%"
      border="1px dashed white"
      flexDirection="row"
    >
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext
          items={topRow.map((f) => f.id)}
          strategy={horizontalListSortingStrategy}
        >
          {topRow.map((f) => (
            <FunctionBlock
              key={f.id}
              id={f.id}
              cognitiveFunction={f.type as CognitiveFunction}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
};
