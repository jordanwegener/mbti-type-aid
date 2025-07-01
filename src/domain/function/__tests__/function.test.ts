import { describe, it, expect } from 'vitest'
import { CognitiveFunction, CognitiveFunctionInfo } from '../function'

describe('CognitiveFunction', () => {
  describe('CognitiveFunction enum', () => {
    it('should have exactly 8 cognitive functions', () => {
      const functions = Object.values(CognitiveFunction)
      expect(functions).toHaveLength(8)
    })

    it('should include all standard cognitive functions', () => {
      const expectedFunctions = ['Fi', 'Fe', 'Ti', 'Te', 'Si', 'Se', 'Ni', 'Ne']
      expectedFunctions.forEach(func => {
        expect(Object.values(CognitiveFunction)).toContain(func)
      })
    })

    it('should have string values matching enum keys', () => {
      expect(CognitiveFunction.Fi).toBe('Fi')
      expect(CognitiveFunction.Fe).toBe('Fe')
      expect(CognitiveFunction.Ti).toBe('Ti')
      expect(CognitiveFunction.Te).toBe('Te')
      expect(CognitiveFunction.Si).toBe('Si')
      expect(CognitiveFunction.Se).toBe('Se')
      expect(CognitiveFunction.Ni).toBe('Ni')
      expect(CognitiveFunction.Ne).toBe('Ne')
    })
  })

  describe('CognitiveFunctionInfo', () => {
    it('should have information for all cognitive functions', () => {
      Object.values(CognitiveFunction).forEach(func => {
        expect(CognitiveFunctionInfo[func]).toBeDefined()
        expect(CognitiveFunctionInfo[func].name).toBeTruthy()
        expect(CognitiveFunctionInfo[func].description).toBeTruthy()
      })
    })

    it('should have correct names for functions', () => {
      expect(CognitiveFunctionInfo[CognitiveFunction.Fi].name).toBe('Introverted Feeling')
      expect(CognitiveFunctionInfo[CognitiveFunction.Fe].name).toBe('Extroverted Feeling')
      expect(CognitiveFunctionInfo[CognitiveFunction.Ti].name).toBe('Introverted Thinking')
      expect(CognitiveFunctionInfo[CognitiveFunction.Te].name).toBe('Extroverted Thinking')
      expect(CognitiveFunctionInfo[CognitiveFunction.Si].name).toBe('Introverted Sensing')
      expect(CognitiveFunctionInfo[CognitiveFunction.Se].name).toBe('Extroverted Sensing')
      expect(CognitiveFunctionInfo[CognitiveFunction.Ni].name).toBe('Introverted Intuition')
      expect(CognitiveFunctionInfo[CognitiveFunction.Ne].name).toBe('Extroverted Intuition')
    })

    it('should have meaningful descriptions', () => {
      Object.values(CognitiveFunction).forEach(func => {
        const info = CognitiveFunctionInfo[func]
        expect(info.description.length).toBeGreaterThan(50) // Meaningful length
        expect(info.description).toContain(func) // Contains the function abbreviation
      })
    })

    it('should distinguish between introverted and extroverted functions', () => {
      const introvertedFunctions = [
        CognitiveFunction.Fi, 
        CognitiveFunction.Ti, 
        CognitiveFunction.Si, 
        CognitiveFunction.Ni
      ]
      const extrovertedFunctions = [
        CognitiveFunction.Fe, 
        CognitiveFunction.Te, 
        CognitiveFunction.Se, 
        CognitiveFunction.Ne
      ]

      introvertedFunctions.forEach(func => {
        expect(CognitiveFunctionInfo[func].name).toContain('Introverted')
      })

      extrovertedFunctions.forEach(func => {
        expect(CognitiveFunctionInfo[func].name).toContain('Extroverted')
      })
    })

    it('should distinguish between thinking, feeling, sensing, and intuition', () => {
      const thinkingFunctions = [CognitiveFunction.Ti, CognitiveFunction.Te]
      const feelingFunctions = [CognitiveFunction.Fi, CognitiveFunction.Fe]
      const sensingFunctions = [CognitiveFunction.Si, CognitiveFunction.Se]
      const intuitionFunctions = [CognitiveFunction.Ni, CognitiveFunction.Ne]

      thinkingFunctions.forEach(func => {
        expect(CognitiveFunctionInfo[func].name).toContain('Thinking')
      })

      feelingFunctions.forEach(func => {
        expect(CognitiveFunctionInfo[func].name).toContain('Feeling')
      })

      sensingFunctions.forEach(func => {
        expect(CognitiveFunctionInfo[func].name).toContain('Sensing')
      })

      intuitionFunctions.forEach(func => {
        expect(CognitiveFunctionInfo[func].name).toContain('Intuition')
      })
    })
  })
})