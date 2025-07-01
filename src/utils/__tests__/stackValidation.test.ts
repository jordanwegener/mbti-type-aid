import { describe, it, expect } from 'vitest'
import { 
  validateStack, 
  validateFunctionPlacement, 
  getValidFunctionsForPosition,
  canPlaceFunction 
} from '../stackValidation'
import { CognitiveFunction } from '@domain/function/function'

describe('stackValidation', () => {
  describe('validateStack', () => {
    it('should allow empty stack', () => {
      const result = validateStack([null, null, null, null])
      expect(result.isValid).toBe(true)
    })

    it('should allow single function', () => {
      const result = validateStack([CognitiveFunction.Fi, null, null, null])
      expect(result.isValid).toBe(true)
    })

    it('should reject duplicate functions', () => {
      const result = validateStack([
        CognitiveFunction.Fi, 
        CognitiveFunction.Fi, 
        null, 
        null
      ])
      expect(result.isValid).toBe(false)
      expect(result.reason).toContain('duplicate')
    })

    it('should reject adjacent introverted functions', () => {
      const result = validateStack([
        CognitiveFunction.Fi, 
        CognitiveFunction.Ti, 
        null, 
        null
      ])
      expect(result.isValid).toBe(false)
      expect(result.reason).toContain('introverted')
    })

    it('should reject adjacent extroverted functions', () => {
      const result = validateStack([
        CognitiveFunction.Fe, 
        CognitiveFunction.Te, 
        null, 
        null
      ])
      expect(result.isValid).toBe(false)
      expect(result.reason).toContain('extroverted')
    })

    it('should allow alternating intro/extro pattern', () => {
      const result = validateStack([
        CognitiveFunction.Fi, 
        CognitiveFunction.Ne, 
        null, 
        null
      ])
      expect(result.isValid).toBe(true)
    })

    it('should validate complete INFP stack', () => {
      const result = validateStack([
        CognitiveFunction.Fi, 
        CognitiveFunction.Ne, 
        CognitiveFunction.Si, 
        CognitiveFunction.Te
      ])
      expect(result.isValid).toBe(true)
    })

    it('should reject stack with wrong opposites (Dom-Inf)', () => {
      const result = validateStack([
        CognitiveFunction.Fi, 
        CognitiveFunction.Ne, 
        CognitiveFunction.Si, 
        CognitiveFunction.Fe // Should be Te
      ])
      expect(result.isValid).toBe(false)
      expect(result.reason).toContain('Dominant and Inferior')
    })

    it('should reject stack with wrong opposites (Aux-Tert)', () => {
      const result = validateStack([
        CognitiveFunction.Fi, 
        CognitiveFunction.Ne, 
        CognitiveFunction.Ni, // Should be Si  
        CognitiveFunction.Te
      ])
      expect(result.isValid).toBe(false)
      expect(result.reason).toContain('Auxiliary and Tertiary')
    })

    it('should reject more than 2 functions of same type', () => {
      const result = validateStack([
        CognitiveFunction.Fi, 
        CognitiveFunction.Te, 
        CognitiveFunction.Ti, // Third thinking/feeling function
        null
      ])
      expect(result.isValid).toBe(false)
      expect(result.reason).toContain('more than 2 functions')
    })
  })

  describe('validateFunctionPlacement', () => {
    it('should validate placing Fi in dominant position', () => {
      const result = validateFunctionPlacement(
        [null, null, null, null],
        CognitiveFunction.Fi,
        0
      )
      expect(result.isValid).toBe(true)
    })

    it('should reject placing Ti after Fi (both introverted)', () => {
      const result = validateFunctionPlacement(
        [CognitiveFunction.Fi, null, null, null],
        CognitiveFunction.Ti,
        1
      )
      expect(result.isValid).toBe(false)
    })

    it('should allow placing Ne after Fi (alternating)', () => {
      const result = validateFunctionPlacement(
        [CognitiveFunction.Fi, null, null, null],
        CognitiveFunction.Ne,
        1
      )
      expect(result.isValid).toBe(true)
    })

    it('should reject placing duplicate function', () => {
      const result = validateFunctionPlacement(
        [CognitiveFunction.Fi, null, null, null],
        CognitiveFunction.Fi,
        1
      )
      expect(result.isValid).toBe(false)
    })
  })

  describe('getValidFunctionsForPosition', () => {
    it('should return all functions for empty stack', () => {
      const validFunctions = getValidFunctionsForPosition(
        [null, null, null, null],
        0
      )
      expect(validFunctions).toHaveLength(8)
      expect(validFunctions).toContain(CognitiveFunction.Fi)
      expect(validFunctions).toContain(CognitiveFunction.Ne)
    })

    it('should only return extroverted functions after introverted dominant', () => {
      const validFunctions = getValidFunctionsForPosition(
        [CognitiveFunction.Fi, null, null, null],
        1
      )
      
      expect(validFunctions).toContain(CognitiveFunction.Ne)
      expect(validFunctions).toContain(CognitiveFunction.Se)
      expect(validFunctions).toContain(CognitiveFunction.Te)
      // Fe is NOT valid because Fi (F) is already in stack
      expect(validFunctions).not.toContain(CognitiveFunction.Fe)
      
      expect(validFunctions).not.toContain(CognitiveFunction.Fi)
      expect(validFunctions).not.toContain(CognitiveFunction.Ti)
      expect(validFunctions).not.toContain(CognitiveFunction.Si)
      expect(validFunctions).not.toContain(CognitiveFunction.Ni)
    })

    it('should only return introverted functions after extroverted dominant', () => {
      const validFunctions = getValidFunctionsForPosition(
        [CognitiveFunction.Ne, null, null, null],
        1
      )
      
      expect(validFunctions).toContain(CognitiveFunction.Fi)
      expect(validFunctions).toContain(CognitiveFunction.Ti)
      expect(validFunctions).toContain(CognitiveFunction.Si)
      // Ni is NOT valid because Ne (N) is already in stack
      expect(validFunctions).not.toContain(CognitiveFunction.Ni)
      
      expect(validFunctions).not.toContain(CognitiveFunction.Ne)
      expect(validFunctions).not.toContain(CognitiveFunction.Se)
      expect(validFunctions).not.toContain(CognitiveFunction.Te)
      expect(validFunctions).not.toContain(CognitiveFunction.Fe)
    })

    it('should exclude functions already in stack', () => {
      const validFunctions = getValidFunctionsForPosition(
        [CognitiveFunction.Fi, CognitiveFunction.Ne, null, null],
        2
      )
      
      expect(validFunctions).not.toContain(CognitiveFunction.Fi)
      expect(validFunctions).not.toContain(CognitiveFunction.Ne)
    })
  })

  describe('canPlaceFunction', () => {
    it('should return true for valid placement', () => {
      const result = canPlaceFunction(
        [CognitiveFunction.Fi, null, null, null],
        CognitiveFunction.Ne,
        1
      )
      expect(result).toBe(true)
    })

    it('should return false for invalid placement', () => {
      const result = canPlaceFunction(
        [CognitiveFunction.Fi, null, null, null],
        CognitiveFunction.Ti,
        1
      )
      expect(result).toBe(false)
    })

    it('should return false for duplicate placement', () => {
      const result = canPlaceFunction(
        [CognitiveFunction.Fi, null, null, null],
        CognitiveFunction.Fi,
        1
      )
      expect(result).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle complete valid INTJ stack', () => {
      const result = validateStack([
        CognitiveFunction.Ni, 
        CognitiveFunction.Te, 
        CognitiveFunction.Fi, 
        CognitiveFunction.Se
      ])
      expect(result.isValid).toBe(true)
    })

    it('should handle complete valid ESTP stack', () => {
      const result = validateStack([
        CognitiveFunction.Se, 
        CognitiveFunction.Ti, 
        CognitiveFunction.Fe, 
        CognitiveFunction.Ni
      ])
      expect(result.isValid).toBe(true)
    })
  })
})