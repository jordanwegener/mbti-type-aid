import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../../App'

// Mock the complex components to isolate App testing
vi.mock('../playground/StackConstructor', () => ({
  StackConstructor: () => <div data-testid="stack-constructor">Stack Constructor Mock</div>
}))

vi.mock('../types/TypeList', () => ({
  TypeList: () => <div data-testid="type-list">Type List Mock</div>
}))

describe('App', () => {
  it('should render app title', () => {
    render(<App />)
    expect(screen.getByText('MBTI Type Aid')).toBeInTheDocument()
  })

  it('should render navigation tabs', () => {
    render(<App />)
    expect(screen.getByText('Stack Builder')).toBeInTheDocument()
    expect(screen.getByText('Browse Types')).toBeInTheDocument()
  })

  it('should show Stack Builder by default', () => {
    render(<App />)
    expect(screen.getByTestId('stack-constructor')).toBeInTheDocument()
    expect(screen.queryByTestId('type-list')).not.toBeInTheDocument()
  })

  it('should switch to Browse Types when tab is clicked', () => {
    render(<App />)
    
    fireEvent.click(screen.getByText('Browse Types'))
    
    expect(screen.getByTestId('type-list')).toBeInTheDocument()
    expect(screen.queryByTestId('stack-constructor')).not.toBeInTheDocument()
  })

  it('should switch back to Stack Builder', () => {
    render(<App />)
    
    // Switch to Browse Types
    fireEvent.click(screen.getByText('Browse Types'))
    expect(screen.getByTestId('type-list')).toBeInTheDocument()
    
    // Switch back to Stack Builder
    fireEvent.click(screen.getByText('Stack Builder'))
    expect(screen.getByTestId('stack-constructor')).toBeInTheDocument()
    expect(screen.queryByTestId('type-list')).not.toBeInTheDocument()
  })

  it('should have dark mode toggle button', () => {
    render(<App />)
    // Look for the button with the brightness icon (using data-testid)
    const brightnessSvg = screen.getByTestId('Brightness7Icon')
    const toggleButton = brightnessSvg.closest('button')
    expect(toggleButton).toBeInTheDocument()
  })

  it('should toggle dark mode when button is clicked', () => {
    render(<App />)
    const brightnessSvg = screen.getByTestId('Brightness7Icon')
    const toggleButton = brightnessSvg.closest('button')!
    
    // Initial state should have dark mode icon (Brightness7)
    expect(screen.getByTestId('Brightness7Icon')).toBeInTheDocument()
    
    // After click, should switch to light mode icon (Brightness4)
    fireEvent.click(toggleButton)
    
    expect(screen.getByTestId('Brightness4Icon')).toBeInTheDocument()
  })

  it('should show appropriate descriptions for each view', () => {
    render(<App />)
    
    // Stack Builder description
    expect(screen.getByText(/Drag and drop cognitive functions to build your stack/)).toBeInTheDocument()
    
    // Switch to Browse Types
    fireEvent.click(screen.getByText('Browse Types'))
    
    // Should not show Stack Builder description anymore
    expect(screen.queryByText(/Drag and drop cognitive functions to build your stack/)).not.toBeInTheDocument()
  })
})