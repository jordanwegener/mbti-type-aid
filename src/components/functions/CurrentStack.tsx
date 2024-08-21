import React from "react";
import { FunctionBlock } from "./FunctionBlock";
import {
  horizontalListSortingStrategy,
  SortableContext
} from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { Grid } from "@mui/material";

export interface UnusedFunctionsProps {
  functions: { id: string; type: string }[];
}

export const CurrentStack = ({ functions }) => {
  const [stack, setStack] = React.useState(functions);

  const getFunctionPosition = (id) => stack.findIndex((f) => f.id === id);

  const onDragEnd = (event) => {
    console.log(event);
    const { active, over } = event;

    if (active.id === over.id) {
      return;
    }

    setStack((stack) => {
      const oldIndex = getFunctionPosition(active.id);
      const newIndex = getFunctionPosition(over.id);
      const newStack = [...stack];
      newStack.splice(oldIndex, 1);
      newStack.splice(newIndex, 0, stack[oldIndex]);
      return newStack;
    });
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{
        height: 200,
        width: "100%",
        border: "1px dashed white"
      }}
    >
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext
          items={functions}
          strategy={horizontalListSortingStrategy}
        >
          {stack.map((f) => (
            <FunctionBlock key={f.id} id={f.id} cognitiveFunction={f.type} />
          ))}
        </SortableContext>
      </DndContext>
    </Grid>
  );
};
