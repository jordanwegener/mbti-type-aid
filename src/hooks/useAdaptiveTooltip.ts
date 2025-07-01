import { useState, useEffect, useRef, useCallback } from 'react';
import { useIsTouchDevice } from './useInputType';

interface UseAdaptiveTooltipOptions {
  /** Delay before showing tooltip on hover (ms) */
  hoverDelay?: number;
  /** Duration for long press to trigger tooltip (ms) */
  longPressDelay?: number;
  /** Whether tooltip is disabled */
  disabled?: boolean;
}

interface UseAdaptiveTooltipReturn {
  /** Whether tooltip should be shown */
  isOpen: boolean;
  /** Props to spread on the target element */
  targetProps: {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onTouchStart?: (e: React.TouchEvent) => void;
    onTouchEnd?: (e: React.TouchEvent) => void;
    onTouchCancel?: (e: React.TouchEvent) => void;
    onTouchMove?: (e: React.TouchEvent) => void;
  };
  /** Manually close the tooltip */
  close: () => void;
}

/**
 * Adaptive tooltip hook that uses hover for mouse and long press for touch
 */
export function useAdaptiveTooltip(options: UseAdaptiveTooltipOptions = {}): UseAdaptiveTooltipReturn {
  const {
    hoverDelay = 1000,
    longPressDelay = 800,
    disabled = false
  } = options;

  const isTouchDevice = useIsTouchDevice();
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, []);

  // Mouse handlers
  const handleMouseEnter = useCallback(() => {
    if (disabled || isTouchDevice) return;
    
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, hoverDelay);
  }, [disabled, isTouchDevice, hoverDelay]);

  const handleMouseLeave = useCallback(() => {
    if (disabled || isTouchDevice) return;
    close();
  }, [disabled, isTouchDevice, close]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || !isTouchDevice) return;
    
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    
    longPressTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, longPressDelay);
  }, [disabled, isTouchDevice, longPressDelay]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (disabled || !isTouchDevice) return;
    
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    
    touchStartRef.current = null;
  }, [disabled, isTouchDevice]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !isTouchDevice || !touchStartRef.current) return;
    
    const touch = e.touches[0];
    const startPos = touchStartRef.current;
    const distance = Math.sqrt(
      Math.pow(touch.clientX - startPos.x, 2) + 
      Math.pow(touch.clientY - startPos.y, 2)
    );
    
    // Cancel long press if finger moves too much (threshold: 10px)
    if (distance > 10) {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
    }
  }, [disabled, isTouchDevice]);

  const handleTouchCancel = useCallback((e: React.TouchEvent) => {
    if (disabled || !isTouchDevice) return;
    
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    
    touchStartRef.current = null;
  }, [disabled, isTouchDevice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, []);

  // Close tooltip when switching input types
  useEffect(() => {
    close();
  }, [isTouchDevice, close]);

  const targetProps = isTouchDevice ? {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
    onTouchMove: handleTouchMove,
  } : {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return {
    isOpen,
    targetProps,
    close
  };
}