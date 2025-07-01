import { CognitiveFunction } from "@domain/function/function";
import { MBTIType, stackMap } from "@data/stack";

export interface StackMatch {
  type: MBTIType;
  score: number;
  matchedPositions: number[];
}

/**
 * Calculate how well a partial stack matches against all complete MBTI stacks
 * Returns matches ordered by best score first
 */
export const findStackMatches = (userStack: (CognitiveFunction | null)[]): StackMatch[] => {
  const matches: StackMatch[] = [];
  
  // Convert stackMap to entries for processing
  const stackEntries = Object.entries(stackMap);
  
  for (const [stackString, type] of stackEntries) {
    const typeStack = stackString.split(',') as CognitiveFunction[];
    const score = calculateStackScore(userStack, typeStack);
    const matchedPositions = getMatchedPositions(userStack, typeStack);
    
    matches.push({
      type,
      score,
      matchedPositions
    });
  }
  
  // Sort by score (highest first)
  matches.sort((a, b) => b.score - a.score);
  
  return matches;
};

/**
 * Calculate a score for how well the user's partial stack matches a complete MBTI stack
 * Scoring system:
 * - Exact position match: 10 points
 * - Function exists elsewhere: 2 points
 * - No match: 0 points
 * - Position weight: Dom=4x, Aux=3x, Tert=2x, Inf=1x
 */
const calculateStackScore = (
  userStack: (CognitiveFunction | null)[], 
  typeStack: CognitiveFunction[]
): number => {
  let score = 0;
  const positionWeights = [4, 3, 2, 1]; // Dom, Aux, Tert, Inf
  
  for (let i = 0; i < userStack.length; i++) {
    const userFunction = userStack[i];
    if (!userFunction) continue;
    
    const weight = positionWeights[i];
    
    if (typeStack[i] === userFunction) {
      // Exact position match
      score += 10 * weight;
    } else if (typeStack.includes(userFunction)) {
      // Function exists but wrong position
      score += 2 * weight;
    }
    // No match = 0 points
  }
  
  return score;
};

/**
 * Get array of positions where functions match exactly
 */
const getMatchedPositions = (
  userStack: (CognitiveFunction | null)[], 
  typeStack: CognitiveFunction[]
): number[] => {
  const matches: number[] = [];
  
  for (let i = 0; i < userStack.length; i++) {
    if (userStack[i] && userStack[i] === typeStack[i]) {
      matches.push(i);
    }
  }
  
  return matches;
};

/**
 * Get filtered matches above a minimum score threshold
 */
export const getRelevantMatches = (
  userStack: (CognitiveFunction | null)[], 
  minScore: number = 10
): StackMatch[] => {
  const allMatches = findStackMatches(userStack);
  return allMatches.filter(match => match.score >= minScore);
};