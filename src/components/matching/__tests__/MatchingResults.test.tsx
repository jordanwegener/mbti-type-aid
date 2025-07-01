import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MatchingResults } from '../MatchingResults'
import { MBTIType } from '@data/stack'
import type { StackMatch } from '@utils/stackMatching'

// Mock the TypeInfoModal to avoid complex modal testing
vi.mock('../../modals/TypeInfoModal', () => ({
  TypeInfoModal: ({ open, type }: { open: boolean; type: string }) => 
    open ? <div data-testid="type-info-modal">Modal for {type}</div> : null
}))

describe('MatchingResults', () => {
  const mockMatches: StackMatch[] = [
    {
      type: MBTIType.INFP,
      score: 100,
      matchedPositions: [0, 1, 2, 3]
    },
    {
      type: MBTIType.ISFP,
      score: 80,
      matchedPositions: [0, 2]
    },
    {
      type: MBTIType.ENFP,
      score: 70,
      matchedPositions: [1]
    },
    {
      type: MBTIType.INFJ,
      score: 60,
      matchedPositions: [0]
    },
    {
      type: MBTIType.ISFJ,
      score: 50,
      matchedPositions: []
    }
  ]

  it('should render "No matches found" when no matches provided', () => {
    render(<MatchingResults matches={[]} />)
    expect(screen.getByText('No matches found')).toBeInTheDocument()
    expect(screen.getByText('Add functions to your stack to see potential MBTI types')).toBeInTheDocument()
  })

  it('should display correct number of matches in title', () => {
    render(<MatchingResults matches={mockMatches} />)
    expect(screen.getByText('Potential Matches (5)')).toBeInTheDocument()
  })

  it('should show only top 3 matches by default', () => {
    render(<MatchingResults matches={mockMatches} />)
    
    // Should show first 3 matches
    expect(screen.getByText('#1 INFP')).toBeInTheDocument()
    expect(screen.getByText('#2 ISFP')).toBeInTheDocument()
    expect(screen.getByText('#3 ENFP')).toBeInTheDocument()
    
    // Should not show 4th and 5th matches
    expect(screen.queryByText('#4 INFJ')).not.toBeInTheDocument()
    expect(screen.queryByText('#5 ISFJ')).not.toBeInTheDocument()
  })

  it('should show expand button when more than 3 matches', () => {
    render(<MatchingResults matches={mockMatches} />)
    expect(screen.getByText('Show 2 more matches')).toBeInTheDocument()
  })

  it('should not show expand button when 3 or fewer matches', () => {
    const fewMatches = mockMatches.slice(0, 3)
    render(<MatchingResults matches={fewMatches} />)
    expect(screen.queryByText(/Show.*more matches/)).not.toBeInTheDocument()
  })

  it('should expand to show more matches when expand button clicked', () => {
    render(<MatchingResults matches={mockMatches} />)
    
    fireEvent.click(screen.getByText('Show 2 more matches'))
    
    // Should now show 4th and 5th matches
    expect(screen.getByText('#4 INFJ')).toBeInTheDocument()
    expect(screen.getByText('#5 ISFJ')).toBeInTheDocument()
    
    // Button text should change
    expect(screen.getByText('Show fewer matches')).toBeInTheDocument()
  })

  it('should collapse back when "Show fewer" clicked', () => {
    render(<MatchingResults matches={mockMatches} />)
    
    // Expand first
    fireEvent.click(screen.getByText('Show 2 more matches'))
    expect(screen.getByText('#4 INFJ')).toBeInTheDocument()
    
    // Then collapse
    fireEvent.click(screen.getByText('Show fewer matches'))
    expect(screen.queryByText('#4 INFJ')).not.toBeInTheDocument()
    expect(screen.getByText('Show 2 more matches')).toBeInTheDocument()
  })

  it('should display correct match percentages', () => {
    render(<MatchingResults matches={mockMatches} />)
    
    // 100% match for perfect INFP
    expect(screen.getByText('100%')).toBeInTheDocument()
    
    // 80% for ISFP (80/100 * 100 = 80%)
    expect(screen.getByText('80%')).toBeInTheDocument()
    
    // 70% for ENFP
    expect(screen.getByText('70%')).toBeInTheDocument()
  })

  it('should show matched positions as chips', () => {
    render(<MatchingResults matches={mockMatches} />)
    
    // INFP should show all 4 position matches
    expect(screen.getByText('Exact position matches: 4 out of 4')).toBeInTheDocument()
    
    // ISFP should show 2 position matches
    expect(screen.getByText('Exact position matches: 2 out of 4')).toBeInTheDocument()
  })

  it('should not show position matches when there are none', () => {
    const noPositionMatches: StackMatch[] = [{
      type: MBTIType.ISFJ,
      score: 50,
      matchedPositions: []
    }]
    
    render(<MatchingResults matches={noPositionMatches} />)
    expect(screen.queryByText(/Exact position matches/)).not.toBeInTheDocument()
  })

  it('should open type info modal when info button clicked', () => {
    render(<MatchingResults matches={mockMatches} />)
    
    // Click the info button for INFP
    const infoButtons = screen.getAllByLabelText(/info/i)
    fireEvent.click(infoButtons[0])
    
    expect(screen.getByTestId('type-info-modal')).toBeInTheDocument()
    expect(screen.getByText('Modal for INFP')).toBeInTheDocument()
  })

  it('should display type nicknames correctly', () => {
    render(<MatchingResults matches={mockMatches} />)
    
    expect(screen.getByText('The Healer')).toBeInTheDocument() // INFP
    expect(screen.getByText('The Composer')).toBeInTheDocument() // ISFP
    expect(screen.getByText('The Champion')).toBeInTheDocument() // ENFP
  })

  it('should respect custom maxMatches prop', () => {
    render(<MatchingResults matches={mockMatches} maxMatches={2} />)
    
    // Should show only 2 matches
    expect(screen.getByText('#1 INFP')).toBeInTheDocument()
    expect(screen.getByText('#2 ISFP')).toBeInTheDocument()
    expect(screen.queryByText('#3 ENFP')).not.toBeInTheDocument()
    
    // Expand button should show 3 more (limited to 8 total, so 6 more after 2)
    expect(screen.getByText('Show 6 more matches')).toBeInTheDocument()
  })
})