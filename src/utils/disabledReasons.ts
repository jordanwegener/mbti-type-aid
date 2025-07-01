import { CognitiveFunction } from "@domain/function/function";
import { validateFunctionPlacement } from "./stackValidation";

/**
 * Get a user-friendly reason why a function cannot be placed in the current stack
 */
export function getDisabledReason(
  currentStack: (CognitiveFunction | null)[],
  functionToPlace: CognitiveFunction
): string {
  // Check for duplicate
  if (currentStack.includes(functionToPlace)) {
    return "Function already exists in stack";
  }

  // Check for type conflicts
  const functionTypes = {
    'Fi': 'F', 'Fe': 'F',
    'Ti': 'T', 'Te': 'T', 
    'Si': 'S', 'Se': 'S',
    'Ni': 'N', 'Ne': 'N'
  };
  
  const newType = functionTypes[functionToPlace];
  const existingTypes = currentStack
    .filter((f): f is CognitiveFunction => f !== null)
    .map(f => functionTypes[f]);
    
  if (existingTypes.includes(newType)) {
    const conflictingFunction = currentStack.find(f => f && functionTypes[f] === newType);
    const typeNames = {
      'F': 'Feeling',
      'T': 'Thinking', 
      'S': 'Sensing',
      'N': 'Intuition'
    };
    return `Only one ${typeNames[newType]} function allowed (${conflictingFunction} already present)`;
  }

  // Check orientation conflicts for each position
  const introvertedFunctions = ['Fi', 'Ti', 'Si', 'Ni'];
  const isIntroverted = introvertedFunctions.includes(functionToPlace);
  
  // Check if it would break alternating pattern anywhere
  for (let pos = 0; pos < 4; pos++) {
    const validation = validateFunctionPlacement(currentStack, functionToPlace, pos);
    if (validation.reason?.includes("orientation")) {
      if (isIntroverted) {
        return "Would create adjacent introverted functions (pattern must alternate)";
      } else {
        return "Would create adjacent extroverted functions (pattern must alternate)";
      }
    }
  }

  return "Cannot be placed in current stack configuration";
}