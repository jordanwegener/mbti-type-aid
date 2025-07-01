import React, { useState, useMemo } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { 
  DndContext, 
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";
import { CognitiveFunction } from "@domain/function/function";
import { getStackType, MBTIType, getTypeInfo } from "@data/stack";
import { FunctionPool } from "../functions/FunctionPool";
import { FunctionSlot } from "../functions/FunctionSlot";
import { SortableFunctionSlot } from "../functions/SortableFunctionSlot";
import { TypeInfoModal } from '../modals/TypeInfoModal';
import { MatchingResults } from "../matching/MatchingResults";
import { findStackMatches } from "@utils/stackMatching";

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

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  // Get all potential matches ordered by score
  const stackMatches = useMemo(() => {
    const userStack = stackSlots.map(slot => slot?.type || null);
    return findStackMatches(userStack);
  }, [stackSlots]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
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

    // Handle slot-to-slot reordering (sortable)
    if (activeId.startsWith("slot-") && overId.startsWith("slot-")) {
      const activeIndex = parseInt(activeId.split("-")[1], 10) - 1;
      const overIndex = parseInt(overId.split("-")[1], 10) - 1;
      
      if (activeIndex !== overIndex) {
        setStackSlots((slots) => {
          return arrayMove(slots, activeIndex, overIndex);
        });
      }
      return;
    }

    // Handle dropping from pool to slot
    if (overId.startsWith("slot-")) {
      const slotIndex = parseInt(overId.split("-")[1], 10) - 1;

      // Find if function is coming from pool
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
      }
    }
  };

  const handleReset = () => {
    setPoolFunctions(initialFunctions);
    setStackSlots([null, null, null, null]);
  };

  const handleRemoveFromSlot = (functionId: string) => {
    setStackSlots((slots) => {
      const newSlots = [...slots];
      const slotIndex = slots.findIndex((slot) => slot?.id === functionId);
      if (slotIndex !== -1) {
        const removedFunction = slots[slotIndex]!;
        newSlots[slotIndex] = null;
        setPoolFunctions((pool) => [...pool, removedFunction]);
      }
      return newSlots;
    });
  };

  // Create slot IDs for sortable context
  const slotIds = stackSlots.map((_, index) => `slot-${index + 1}`);

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Stack spacing={4}>

        <FunctionPool 
          availableFunctions={poolFunctions} 
          onReset={handleReset}
        />

        <Stack spacing={3}>
          {/* Primary Functions Row */}
          <Box>
            <Typography variant="h6" align="center" gutterBottom>
              Primary Functions
            </Typography>
            <SortableContext items={slotIds} strategy={horizontalListSortingStrategy}>
              <Box
                display="flex"
                gap={2}
                justifyContent="center"
                sx={{ overflowX: "auto", pb: 1 }}
              >
                {stackSlots.map((func, index) => (
                  <SortableFunctionSlot
                    key={`slot-${index + 1}`}
                    id={`slot-${index + 1}`}
                    label={SLOT_LABELS.primary[index]}
                    function={func}
                    onRemove={handleRemoveFromSlot}
                  />
                ))}
              </Box>
            </SortableContext>
          </Box>

          {/* Shadow Functions Row */}
          <Box>
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              color="text.secondary"
            >
              Shadow Functions (Auto-Mirrored)
            </Typography>
            <Box
              display="flex"
              gap={2}
              justifyContent="center"
              sx={{ overflowX: "auto", pb: 1 }}
            >
              {shadowFunctions.map((func, index) => (
                <FunctionSlot
                  key={`shadow-${index + 1}`}
                  id={`shadow-${index + 1}`}
                  label={SLOT_LABELS.shadow[index]}
                  function={func}
                  isShadow
                />
              ))}
            </Box>
          </Box>
        </Stack>

        {stackType && (
          <Box textAlign="center" py={2} sx={{ backgroundColor: 'success.light', borderRadius: 2, mb: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'success.contrastText' }}>
              Perfect Match: {stackType} - {getTypeInfo(stackType).nickname}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setIsModalOpen(true)}
              color="success"
            >
              View Type Details
            </Button>
          </Box>
        )}

        <MatchingResults matches={stackMatches} />

        <TypeInfoModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={stackType}
          typeInfo={stackType ? getTypeInfo(stackType) : undefined}
        />
      </Stack>
    </DndContext>
  );
};
