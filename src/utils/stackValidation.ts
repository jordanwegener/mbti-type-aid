import { CognitiveFunction } from "@domain/function/function";

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * MBTI Cognitive Function Stack Validation Rules:
 * 1. Dominant and Auxiliary must alternate introversion/extroversion
 * 2. Tertiary and Inferior must alternate introversion/extroversion 
 * 3. No two functions can be the same type (T/F, N/S)
 * 4. Dominant and Inferior must be opposite functions
 * 5. Auxiliary and Tertiary must be opposite functions
 * 6. One pair must be T/F (judging), other pair must be N/S (perceiving)
 */

const INTROVERTED_FUNCTIONS = [
  CognitiveFunction.Fi, 
  CognitiveFunction.Ti, 
  CognitiveFunction.Si, 
  CognitiveFunction.Ni
];

const EXTROVERTED_FUNCTIONS = [
  CognitiveFunction.Fe, 
  CognitiveFunction.Te, 
  CognitiveFunction.Se, 
  CognitiveFunction.Ne
];

const THINKING_FUNCTIONS = [CognitiveFunction.Ti, CognitiveFunction.Te];
const FEELING_FUNCTIONS = [CognitiveFunction.Fi, CognitiveFunction.Fe];
const SENSING_FUNCTIONS = [CognitiveFunction.Si, CognitiveFunction.Se];
const INTUITION_FUNCTIONS = [CognitiveFunction.Ni, CognitiveFunction.Ne];

const OPPOSITE_FUNCTIONS: Record<CognitiveFunction, CognitiveFunction> = {
  [CognitiveFunction.Fi]: CognitiveFunction.Te,
  [CognitiveFunction.Te]: CognitiveFunction.Fi,
  [CognitiveFunction.Fe]: CognitiveFunction.Ti,
  [CognitiveFunction.Ti]: CognitiveFunction.Fe,
  [CognitiveFunction.Ni]: CognitiveFunction.Se,
  [CognitiveFunction.Se]: CognitiveFunction.Ni,
  [CognitiveFunction.Ne]: CognitiveFunction.Si,
  [CognitiveFunction.Si]: CognitiveFunction.Ne
};

function isIntroverted(func: CognitiveFunction): boolean {
  return INTROVERTED_FUNCTIONS.includes(func);
}

function isExtroverted(func: CognitiveFunction): boolean {
  return EXTROVERTED_FUNCTIONS.includes(func);
}

function getFunctionType(func: CognitiveFunction): 'T' | 'F' | 'N' | 'S' {
  if (THINKING_FUNCTIONS.includes(func)) return 'T';
  if (FEELING_FUNCTIONS.includes(func)) return 'F';
  if (INTUITION_FUNCTIONS.includes(func)) return 'N';
  if (SENSING_FUNCTIONS.includes(func)) return 'S';
  throw new Error(`Unknown function: ${func}`);
}

/**
 * Check if adding a function to a specific position would create a valid stack
 */
export function validateFunctionPlacement(
  currentStack: (CognitiveFunction | null)[],
  newFunction: CognitiveFunction,
  position: number
): ValidationResult {
  // 1. Check for duplicates
  if (currentStack.includes(newFunction)) {
    return { 
      isValid: false, 
      reason: "Function already exists in stack" 
    };
  }

  // 2. Check type conflicts (only one N, S, T, F allowed)
  const newFunctionType = getFunctionType(newFunction);
  const existingTypes = currentStack
    .filter((f): f is CognitiveFunction => f !== null)
    .map(getFunctionType);
    
  if (existingTypes.includes(newFunctionType)) {
    return { 
      isValid: false, 
      reason: `Cannot have multiple ${newFunctionType} functions` 
    };
  }

  // 3. Check alternating intro/extro pattern
  const isNewFunctionIntroverted = isIntroverted(newFunction);
  
  // Check previous position
  if (position > 0 && currentStack[position - 1]) {
    const prevFunction = currentStack[position - 1]!;
    const isPrevIntroverted = isIntroverted(prevFunction);
    
    if (isNewFunctionIntroverted === isPrevIntroverted) {
      return { 
        isValid: false, 
        reason: "Adjacent functions cannot have same orientation" 
      };
    }
  }
  
  // Check next position  
  if (position < 3 && currentStack[position + 1]) {
    const nextFunction = currentStack[position + 1]!;
    const isNextIntroverted = isIntroverted(nextFunction);
    
    if (isNewFunctionIntroverted === isNextIntroverted) {
      return { 
        isValid: false, 
        reason: "Adjacent functions cannot have same orientation" 
      };
    }
  }

  return { isValid: true };
}

/**
 * Validate an entire cognitive function stack against MBTI rules
 */
export function validateStack(stack: (CognitiveFunction | null)[]): ValidationResult {
  const functions = stack.filter((f): f is CognitiveFunction => f !== null);
  
  if (functions.length === 0) {
    return { isValid: true }; // Empty stack is valid
  }

  // Rule 1: No duplicate functions
  const functionSet = new Set(functions);
  if (functionSet.size !== functions.length) {
    return { 
      isValid: false, 
      reason: "Cannot have duplicate cognitive functions" 
    };
  }

  // Rule 2: Check for balanced function types
  const functionTypes = functions.map(getFunctionType);
  const typeCount = functionTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // For partial stacks (less than 4), allow some flexibility
  // For complete stacks, must have exactly 2 judging (T/F) and 2 perceiving (N/S)
  if (functions.length >= 3) {
    const judgingCount = (typeCount.T || 0) + (typeCount.F || 0);
    const perceivingCount = (typeCount.N || 0) + (typeCount.S || 0);
    
    if (judgingCount > 2 || perceivingCount > 2) {
      return { 
        isValid: false, 
        reason: "Cannot have more than 2 functions of the same type (T/F or N/S)" 
      };
    }
  }

  // For stacks with 2+ functions, check alternating intro/extro pattern
  if (functions.length >= 2) {
    for (let i = 0; i < functions.length - 1; i++) {
      const current = functions[i];
      const next = functions[i + 1];
      
      if (!current || !next) continue;
      
      // Adjacent functions must alternate introversion/extroversion
      if (isIntroverted(current) && isIntroverted(next)) {
        return { 
          isValid: false, 
          reason: "Adjacent functions cannot both be introverted" 
        };
      }
      if (isExtroverted(current) && isExtroverted(next)) {
        return { 
          isValid: false, 
          reason: "Adjacent functions cannot both be extroverted" 
        };
      }
    }
  }

  // For complete stacks (4 functions), check additional rules
  if (functions.length === 4) {
    const [dom, aux, tert, inf] = functions;

    // Rule 3: Dominant and Inferior must be opposites
    if (OPPOSITE_FUNCTIONS[dom] !== inf) {
      return { 
        isValid: false, 
        reason: "Dominant and Inferior functions must be opposites" 
      };
    }

    // Rule 4: Auxiliary and Tertiary must be opposites  
    if (OPPOSITE_FUNCTIONS[aux] !== tert) {
      return { 
        isValid: false, 
        reason: "Auxiliary and Tertiary functions must be opposites" 
      };
    }

    // Rule 5: Must have one judging pair (T/F) and one perceiving pair (N/S)
    const domType = getFunctionType(dom);
    const auxType = getFunctionType(aux);
    
    const isJudgingDominant = domType === 'T' || domType === 'F';
    const isPerceivingAuxiliary = auxType === 'N' || auxType === 'S';
    
    if (!(isJudgingDominant && isPerceivingAuxiliary) && 
        !(!isJudgingDominant && !isPerceivingAuxiliary)) {
      return { 
        isValid: false, 
        reason: "Must have one judging (T/F) and one perceiving (N/S) function pair" 
      };
    }
  }

  return { isValid: true };
}

/**
 * Get list of valid functions that can be placed at a specific position
 */
export function getValidFunctionsForPosition(
  currentStack: (CognitiveFunction | null)[],
  position: number
): CognitiveFunction[] {
  const allFunctions = Object.values(CognitiveFunction);
  const validFunctions: CognitiveFunction[] = [];

  for (const func of allFunctions) {
    // Skip if function is already in the stack
    if (currentStack.includes(func)) continue;

    const validation = validateFunctionPlacement(currentStack, func, position);
    if (validation.isValid) {
      validFunctions.push(func);
    }
  }

  return validFunctions;
}

/**
 * Check if a specific function can be placed at a position
 */
export function canPlaceFunction(
  currentStack: (CognitiveFunction | null)[],
  newFunction: CognitiveFunction,
  position: number
): boolean {
  // Skip validation if slot is being cleared or if same function
  if (!newFunction) return true;
  if (currentStack[position]?.valueOf() === newFunction) return true;
  
  // Create test stack with new function
  const testStack = [...currentStack];
  testStack[position] = newFunction;
  
  return validateFunctionPlacement(currentStack, newFunction, position).isValid;
}