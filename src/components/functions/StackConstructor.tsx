import React, { useState } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { CognitiveFunction } from "@domain/function/function";
import { getStackType } from "@data/stack";
import { FunctionPool } from "./FunctionPool";
import { FunctionSlot } from "./FunctionSlot";

interface CognitiveItem {
  id: string;
  type: CognitiveFunction;
}

const initialFunctions: CognitiveItem[] = [
  { id: "Fi", type: CognitiveFunction.Fi },
  { id: "Fe", type: CognitiveFunction.Fe },
  { id: "Ti", type: CognitiveFunction.Ti },
  { id: "Te", type: CognitiveFunction.Te },
  { id: "Si", type: CognitiveFunction.Si },
  { id: "Se", type: CognitiveFunction.Se },
  { id: "Ni", type: CognitiveFunction.Ni },
  { id: "Ne", type: CognitiveFunction.Ne }
];

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

const SLOT_LABELS = {
  primary: ["Dominant", "Auxiliary", "Tertiary", "Inferior"],
  shadow: ["Opposing", "Critical Parent", "Deceiving", "Demonstrative"]
};

export const StackConstructor: React.FC = () => {
  const [poolFunctions, setPoolFunctions] =
    useState<CognitiveItem[]>(initialFunctions);
  const [stackSlots, setStackSlots] = useState<(CognitiveItem | null)[]>([
    null,
    null,
    null,
    null
  ]);

  // Calculate shadow functions based on primary stack
  const shadowFunctions = stackSlots.map((slot) =>
    slot
      ? { id: `shadow-${slot.id}`, type: mirrorFunctionMap[slot.type] }
      : null
  );

  // Get MBTI type based on current stack
  const stackString = stackSlots
    .filter((slot): slot is CognitiveItem => slot !== null)
    .map((f) => f.type)
    .join(",");
  const stackType = getStackType(stackString);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle dropping back to pool
    if (overId === "function-pool") {
      setStackSlots((slots) => {
        const newSlots = [...slots];
        const slotIndex = slots.findIndex((slot) => slot?.id === activeId);
        if (slotIndex !== -1) {
          const removedFunction = slots[slotIndex]!;
          newSlots[slotIndex] = null;
          setPoolFunctions((pool) => [...pool, removedFunction]);
        }
        return newSlots;
      });
      return;
    }

    // Handle dropping to a slot
    if (overId.startsWith("slot-")) {
      const slotIndex = parseInt(overId.split("-")[1], 10) - 1;

      // Find if function is coming from pool or another slot
      const poolIndex = poolFunctions.findIndex((f) => f.id === activeId);
      if (poolIndex !== -1) {
        // Coming from pool
        const functionToMove = poolFunctions[poolIndex];
        const newPoolFunctions = [...poolFunctions];
        newPoolFunctions.splice(poolIndex, 1);
        setPoolFunctions(newPoolFunctions);

        setStackSlots((slots) => {
          const newSlots = [...slots];
          // If there was a function in the target slot, move it back to pool
          if (newSlots[slotIndex]) {
            setPoolFunctions((pool) => [...pool, newSlots[slotIndex]!]);
          }
          newSlots[slotIndex] = functionToMove;
          return newSlots;
        });
      } else {
        // Moving between slots
        setStackSlots((slots) => {
          const newSlots = [...slots];
          const oldSlotIndex = slots.findIndex((slot) => slot?.id === activeId);
          const functionToMove = slots[oldSlotIndex];
          newSlots[oldSlotIndex] = slots[slotIndex];
          newSlots[slotIndex] = functionToMove;
          return newSlots;
        });
      }
    }
  };

  const handleReset = () => {
    setPoolFunctions(initialFunctions);
    setStackSlots([null, null, null, null]);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Stack spacing={4}>
        <Box display="flex" gap={2} justifyContent="center">
          <Stack spacing={2}>
            {/* Primary Functions */}
            {stackSlots.map((func, index) => (
              <FunctionSlot
                key={`slot-${index + 1}`}
                id={`slot-${index + 1}`}
                label={SLOT_LABELS.primary[index]}
                function={func}
              />
            ))}
          </Stack>

          <Stack spacing={2}>
            {/* Shadow Functions */}
            {shadowFunctions.map((func, index) => (
              <FunctionSlot
                key={`shadow-${index + 1}`}
                id={`shadow-${index + 1}`}
                label={SLOT_LABELS.shadow[index]}
                function={func}
                isShadow
              />
            ))}
          </Stack>
        </Box>

        <FunctionPool availableFunctions={poolFunctions} />

        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>
            {stackType ? `Type: ${stackType}` : "Complete your primary stack"}
          </Typography>
          <Button variant="outlined" onClick={handleReset} sx={{ mt: 2 }}>
            Reset
          </Button>
        </Box>
      </Stack>
    </DndContext>
  );
};
