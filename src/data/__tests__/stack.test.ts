import { describe, it, expect } from 'vitest'
import { getStackType, getTypeInfo, MBTIType, stackMap, MBTITypeDescriptions } from '../stack'

describe('stack', () => {
  describe('getStackType', () => {
    it('should return correct MBTI type for valid stack string', () => {
      expect(getStackType('Fi,Ne,Si,Te')).toBe(MBTIType.INFP)
      expect(getStackType('Ni,Te,Fi,Se')).toBe(MBTIType.INTJ)
      expect(getStackType('Se,Ti,Fe,Ni')).toBe(MBTIType.ESTP)
    })

    it('should return undefined for invalid stack string', () => {
      expect(getStackType('Invalid,Stack')).toBeUndefined()
      expect(getStackType('')).toBeUndefined()
      expect(getStackType('Fi,Ne,Si')).toBeUndefined() // Incomplete stack
    })

    it('should be case sensitive', () => {
      expect(getStackType('fi,ne,si,te')).toBeUndefined()
      expect(getStackType('FI,NE,SI,TE')).toBeUndefined()
    })
  })

  describe('getTypeInfo', () => {
    it('should return correct type information', () => {
      const infpInfo = getTypeInfo(MBTIType.INFP)
      expect(infpInfo.nickname).toBe('The Healer')
      expect(infpInfo.name).toBe('Introverted Feeling Intuition Perceiving')
      expect(infpInfo.strengths).toContain('Creative and imaginative')
      expect(infpInfo.challenges).toContain('May be too idealistic')
    })

    it('should have complete information for all types', () => {
      Object.values(MBTIType).forEach(type => {
        const info = getTypeInfo(type)
        expect(info.name).toBeTruthy()
        expect(info.nickname).toBeTruthy()
        expect(info.description).toBeTruthy()
        expect(info.strengths.length).toBeGreaterThan(0)
        expect(info.challenges.length).toBeGreaterThan(0)
      })
    })
  })

  describe('stackMap', () => {
    it('should contain exactly 16 MBTI types', () => {
      const types = Object.values(stackMap)
      expect(types).toHaveLength(16)
      
      // Should have all 16 unique MBTI types
      const uniqueTypes = new Set(types)
      expect(uniqueTypes.size).toBe(16)
    })

    it('should have valid cognitive function stacks', () => {
      Object.keys(stackMap).forEach(stackString => {
        const functions = stackString.split(',')
        expect(functions).toHaveLength(4)
        
        // Each function should be a valid cognitive function
        const validFunctions = ['Fi', 'Fe', 'Ti', 'Te', 'Si', 'Se', 'Ni', 'Ne']
        functions.forEach(func => {
          expect(validFunctions).toContain(func)
        })
      })
    })

    it('should have no duplicate stack strings', () => {
      const stackStrings = Object.keys(stackMap)
      const uniqueStackStrings = new Set(stackStrings)
      expect(uniqueStackStrings.size).toBe(stackStrings.length)
    })

    it('should follow MBTI cognitive function rules', () => {
      Object.entries(stackMap).forEach(([stackString, type]) => {
        const functions = stackString.split(',')
        const [dom, aux, tert, inf] = functions
        
        // Dominant and inferior should be opposites
        const opposites = {
          'Fi': 'Te', 'Te': 'Fi',
          'Fe': 'Ti', 'Ti': 'Fe',
          'Ni': 'Se', 'Se': 'Ni',
          'Ne': 'Si', 'Si': 'Ne'
        }
        expect(opposites[dom as keyof typeof opposites]).toBe(inf)
        
        // Auxiliary and tertiary should be opposites
        expect(opposites[aux as keyof typeof opposites]).toBe(tert)
      })
    })
  })

  describe('MBTITypeDescriptions', () => {
    it('should have descriptions for all 16 types', () => {
      Object.values(MBTIType).forEach(type => {
        expect(MBTITypeDescriptions[type]).toBeDefined()
      })
    })

    it('should have consistent structure for all descriptions', () => {
      Object.values(MBTITypeDescriptions).forEach(description => {
        expect(description.name).toBeTruthy()
        expect(description.nickname).toBeTruthy()
        expect(description.description).toBeTruthy()
        expect(Array.isArray(description.strengths)).toBe(true)
        expect(Array.isArray(description.challenges)).toBe(true)
        expect(description.strengths.length).toBeGreaterThan(0)
        expect(description.challenges.length).toBeGreaterThan(0)
      })
    })
  })
})