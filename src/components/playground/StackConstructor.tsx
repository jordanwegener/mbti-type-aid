import React, { useState, useMemo } from "react";
import { Box, Stack, Typography, Button, Paper } from "@mui/material";
import { 
  DndContext, 
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
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
import { canPlaceFunction, getValidFunctionsForPosition, validateStack } from "@utils/stackValidation";
import { designTokens } from "../../theme";

interface CognitiveItem {
  id: string;
  type: CognitiveFunction;
}

const initialFunctions: CognitiveItem[] = [
  { id: "pool-Fi", type: CognitiveFunction.Fi },
  { id: "pool-Fe", type: CognitiveFunction.Fe },
  { id: "pool-Ti", type: CognitiveFunction.Ti },
  { id: "pool-Te", type: CognitiveFunction.Te },
  { id: "pool-Si", type: CognitiveFunction.Si },
  { id: "pool-Se", type: CognitiveFunction.Se },
  { id: "pool-Ni", type: CognitiveFunction.Ni },
  { id: "pool-Ne", type: CognitiveFunction.Ne }
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

// Helper function to create unique function items
const createFunctionItem = (type: CognitiveFunction, context: 'pool' | 'slot' = 'pool'): CognitiveItem => ({
  id: `${context}-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type
});

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
  const [dragValidation, setDragValidation] = useState<Record<string, boolean>>({});

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

  // Calculate which functions are disabled in the pool
  const disabledPoolFunctions = useMemo(() => {
    const currentStackTypes = stackSlots.map(slot => slot?.type || null);
    const disabled = new Set<CognitiveFunction>();
    
    poolFunctions.forEach(poolFunc => {
      // Check if this function can be placed in ANY empty slot
      let canPlaceAnywhere = false;
      for (let i = 0; i < 4; i++) {
        // Only check empty slots or slots that would be replaced
        if (canPlaceFunction(currentStackTypes, poolFunc.type, i)) {
          canPlaceAnywhere = true;
          break;
        }
      }
      if (!canPlaceAnywhere) {
        disabled.add(poolFunc.type);
      }
    });
    
    return disabled;
  }, [stackSlots, poolFunctions]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string;
    setActiveId(activeId);
    
    // Pre-calculate validation for all slots when drag starts
    const validation: Record<string, boolean> = {};
    
    // Find the function being dragged
    let draggedFunction: CognitiveFunction | null = null;
    
    // Check if it's from pool
    const poolFunction = poolFunctions.find(f => f.id === activeId);
    if (poolFunction) {
      draggedFunction = poolFunction.type;
    } else {
      // Check if it's from a slot by finding the function with this ID
      const slotFunction = stackSlots.find(slot => slot?.id === activeId);
      if (slotFunction) {
        draggedFunction = slotFunction.type;
      } else if (activeId.startsWith('slot-')) {
        // Fallback: check by slot index
        const slotIndex = parseInt(activeId.split('-')[1], 10) - 1;
        if (stackSlots[slotIndex]) {
          draggedFunction = stackSlots[slotIndex]!.type;
        }
      }
    }
    
    if (draggedFunction) {
      const currentStackTypes = stackSlots.map(slot => slot?.type || null);
      
      // If dragging from a slot, temporarily remove it from the current stack
      let testStack = [...currentStackTypes];
      const draggedSlotIndex = stackSlots.findIndex(slot => slot?.id === activeId);
      if (draggedSlotIndex !== -1) {
        testStack[draggedSlotIndex] = null;
      } else if (activeId.startsWith('slot-')) {
        // Fallback: parse slot index
        const slotIndex = parseInt(activeId.split('-')[1], 10) - 1;
        testStack[slotIndex] = null;
      }
      
      // Check validation for each slot
      for (let i = 0; i < 4; i++) {
        const slotId = `slot-${i + 1}`;
        validation[slotId] = canPlaceFunction(testStack, draggedFunction, i);
      }
    }
    
    setDragValidation(validation);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDragValidation({});
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle dropping back to pool
    if (overId === "function-pool") {
      const slotIndex = stackSlots.findIndex((slot) => slot?.id === activeId);
      if (slotIndex !== -1) {
        const removedFunction = stackSlots[slotIndex]!;
        
        // Update both states cleanly
        setStackSlots((slots) => {
          const newSlots = [...slots];
          newSlots[slotIndex] = null;
          return newSlots;
        });
        setPoolFunctions((pool) => [...pool, createFunctionItem(removedFunction.type, 'pool')]);
      }
      return;
    }

    // Handle slot-to-slot reordering (sortable)
    if (activeId.startsWith("slot-") && overId.startsWith("slot-")) {
      const activeIndex = parseInt(activeId.split("-")[1], 10) - 1;
      const overIndex = parseInt(overId.split("-")[1], 10) - 1;
      
      if (activeIndex !== overIndex && stackSlots[activeIndex]) {
        // Test the move for validity
        const testSlots = arrayMove([...stackSlots], activeIndex, overIndex);
        const testStackTypes = testSlots.map(slot => slot?.type || null);
        
        // Validate the resulting stack
        const validation = validateStack(testStackTypes);
        if (validation.isValid) {
          setStackSlots(testSlots);
        }
        // If invalid, do nothing (could add visual feedback)
      }
      return;
    }

    // Handle dropping from pool to slot
    if (overId.startsWith("slot-")) {
      const slotIndex = parseInt(overId.split("-")[1], 10) - 1;

      // Find if function is coming from pool
      const poolIndex = poolFunctions.findIndex((f) => f.id === activeId);
      if (poolIndex !== -1) {
        const functionToMove = poolFunctions[poolIndex];
        
        // Validate placement using current stack state
        const currentStackTypes = stackSlots.map(slot => slot?.type || null);
        const isValidPlacement = canPlaceFunction(currentStackTypes, functionToMove.type, slotIndex);
        
        if (!isValidPlacement) {
          // Invalid placement - do nothing (could add visual feedback here)
          return;
        }
        
        // Coming from pool - handle both state updates together
        const currentSlotFunction = stackSlots[slotIndex];
        
        // Update pool functions
        const newPoolFunctions = [...poolFunctions];
        newPoolFunctions.splice(poolIndex, 1);
        
        // If there was a function in the target slot, add it back to pool
        if (currentSlotFunction) {
          newPoolFunctions.push(createFunctionItem(currentSlotFunction.type, 'pool'));
        }
        
        // Update both states
        setPoolFunctions(newPoolFunctions);
        setStackSlots((slots) => {
          const newSlots = [...slots];
          newSlots[slotIndex] = createFunctionItem(functionToMove.type, 'slot');
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
    const slotIndex = stackSlots.findIndex((slot) => slot?.id === functionId);
    if (slotIndex !== -1) {
      const removedFunction = stackSlots[slotIndex]!;
      
      setStackSlots((slots) => {
        const newSlots = [...slots];
        newSlots[slotIndex] = null;
        return newSlots;
      });
      setPoolFunctions((pool) => [...pool, createFunctionItem(removedFunction.type, 'pool')]);
    }
  };

  // Create slot IDs for sortable context - use function ID if present, otherwise slot ID
  const slotIds = stackSlots.map((slot, index) => slot ? slot.id : `slot-${index + 1}`);

  // Get the active item for drag overlay
  const activeItem = useMemo(() => {
    if (!activeId) return null;
    
    // Check if it's from pool
    const poolItem = poolFunctions.find(f => f.id === activeId);
    if (poolItem) return poolItem;
    
    // Check if it's from slots by function ID
    const slotItem = stackSlots.find(slot => slot?.id === activeId);
    if (slotItem) return slotItem;
    
    // Fallback: check by slot index
    if (activeId.startsWith('slot-')) {
      const slotIndex = parseInt(activeId.split('-')[1], 10) - 1;
      return stackSlots[slotIndex];
    }
    
    return null;
  }, [activeId, poolFunctions, stackSlots]);

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
          disabledFunctions={disabledPoolFunctions}
          currentStack={stackSlots.map(slot => slot?.type || null)}
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
                gap={designTokens.slots.spacing / 8}
                justifyContent="center"
                sx={{ 
                  overflowX: "auto", 
                  pb: 1,
                  // Use calculated width that accounts for hover scaling
                  width: `${designTokens.slots.containerWidth}px`,
                  maxWidth: '100%',
                  mx: 'auto'
                }}
              >
                {stackSlots.map((func, index) => {
                  const slotId = `slot-${index + 1}`;
                  const itemId = func ? func.id : slotId; // Use function ID if present, otherwise slot ID
                  const canAccept = dragValidation[slotId] !== false;
                  const isInvalid = activeId && dragValidation[slotId] === false;
                  
                  return (
                    <SortableFunctionSlot
                      key={slotId}
                      id={itemId}
                      label={SLOT_LABELS.primary[index]}
                      function={func}
                      onRemove={handleRemoveFromSlot}
                      canAcceptDrop={canAccept}
                      isInvalidDrop={!!isInvalid}
                    />
                  );
                })}
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
              gap={designTokens.slots.spacing / 8}
              justifyContent="center"
              sx={{ 
                overflowX: "auto", 
                pb: 1,
                // Match the primary functions width for perfect alignment
                width: `${designTokens.slots.containerWidth}px`,
                maxWidth: '100%',
                mx: 'auto'
              }}
            >
              {shadowFunctions.map((func, index) => (
                <SortableFunctionSlot
                  key={`shadow-${index + 1}`}
                  id={`shadow-${index + 1}`}
                  label={SLOT_LABELS.shadow[index]}
                  function={func}
                  isShadow
                  canAcceptDrop={true}
                  isInvalidDrop={false}
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

      <DragOverlay>
        {activeItem ? (
          <Paper
            elevation={8}
            sx={{
              p: 2,
              backgroundColor: "background.paper",
              minWidth: 80,
              textAlign: "center",
              cursor: 'grabbing',
              pointerEvents: 'none',
              transform: 'rotate(5deg)',
              opacity: 0.95,
              border: "2px solid",
              borderColor: "primary.main"
            }}
          >
            <Typography variant="h6" color="primary">
              {activeItem.type}
            </Typography>
          </Paper>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
