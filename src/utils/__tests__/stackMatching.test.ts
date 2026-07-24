import { describe, it, expect } from 'vitest'
import { findStackMatches, getRelevantMatches } from '../stackMatching'
import { CognitiveFunction } from '@domain/function/function'
import { MBTIType } from '@data/stack'

describe('stackMatching', () => {
  describe('findStackMatches', () => {
    it('should return all 16 MBTI types when no stack is provided', () => {
      const matches = findStackMatches([null, null, null, null])
      expect(matches).toHaveLength(16)
      expect(matches.every(match => match.score === 0)).toBe(true)
    })

    it('should prioritize exact position matches', () => {
      // Both INFP and ISFP have Fi as dominant, so let's use a unique dominant function
      const userStack = [CognitiveFunction.Ni, null, null, null]
      const matches = findStackMatches(userStack)
      
      // INTJ or INFJ should be at the top since Ni is dominant for both
      expect(matches[0].type).toMatch(/^IN[TF]J$/)
      expect(matches[0].score).toBeGreaterThan(0)
      expect(matches[0].matchedPositions).toContain(0)
    })

    it('should score complete INFP stack correctly', () => {
      const infpStack = [
        CognitiveFunction.Fi, 
        CognitiveFunction.Ne, 
        CognitiveFunction.Si, 
        CognitiveFunction.Te
      ]
      const matches = findStackMatches(infpStack)
      
      const infpMatch = matches.find(m => m.type === MBTIType.INFP)
      expect(infpMatch).toBeDefined()
      expect(infpMatch!.score).toBe(100) // Perfect match: 10*4 + 10*3 + 10*2 + 10*1
      expect(infpMatch!.matchedPositions).toEqual([0, 1, 2, 3])
    })

    it('should handle partial matches correctly', () => {
      const partialStack = [CognitiveFunction.Fi, CognitiveFunction.Ne, null, null]
      const matches = findStackMatches(partialStack)
      
      const infpMatch = matches.find(m => m.type === MBTIType.INFP)
      expect(infpMatch).toBeDefined()
      expect(infpMatch!.score).toBe(70) // 10*4 + 10*3 = 70
      expect(infpMatch!.matchedPositions).toEqual([0, 1])
    })

    it('should penalize wrong position matches', () => {
      // Ne in dominant position, Fi in auxiliary position (opposite of INFP which is Fi, Ne)
      const wrongPositionStack = [CognitiveFunction.Ne, CognitiveFunction.Fi, null, null]
      const matches = findStackMatches(wrongPositionStack)
      
      const infpMatch = matches.find(m => m.type === MBTIType.INFP)
      expect(infpMatch).toBeDefined()
      // INFP has Fi-Ne-Si-Te, user has Ne-Fi
      // Ne is in position 0 but should be in position 1 for INFP = wrong position penalty
      // Fi is in position 1 but should be in position 0 for INFP = wrong position penalty
      // No exact position matches
      expect(infpMatch!.score).toBeGreaterThan(0) // Should have some score from wrong positions
      expect(infpMatch!.matchedPositions).toEqual([]) // No exact position matches
    })

    it('should sort matches by score descending', () => {
      const userStack = [CognitiveFunction.Ni, null, null, null]
      const matches = findStackMatches(userStack)
      
      for (let i = 1; i < matches.length; i++) {
        expect(matches[i-1].score).toBeGreaterThanOrEqual(matches[i].score)
      }
    })
  })

  describe('getRelevantMatches', () => {
    it('should filter matches above minimum score', () => {
      const userStack = [CognitiveFunction.Fi, null, null, null]
      const relevantMatches = getRelevantMatches(userStack, 20)
      
      // Should only include matches with score >= 20
      expect(relevantMatches.every(match => match.score >= 20)).toBe(true)
    })

    it('should return empty array when no matches meet threshold', () => {
      const userStack = [null, null, null, null]
      const relevantMatches = getRelevantMatches(userStack, 10)
      
      expect(relevantMatches).toHaveLength(0)
    })

    it('should use default minimum score of 10', () => {
      const userStack = [CognitiveFunction.Ti, null, null, null]
      const relevantMatches = getRelevantMatches(userStack)
      
      expect(relevantMatches.every(match => match.score >= 10)).toBe(true)
    })
  })
})