import { useState, useEffect } from 'react';

export type InputType = 'mouse' | 'touch' | 'pen' | null;

/**
 * Hook to detect the user's input type (mouse, touch, pen)
 * Updates in real-time based on user interactions
 */
export function useInputType(): InputType {
  const [inputType, setInputType] = useState<InputType>(null);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      setInputType(event.pointerType as InputType);
    };

    // Also detect initial capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasFineMouse = window.matchMedia('(pointer: fine)').matches;
    
    // Set initial state based on capabilities
    if (!inputType) {
      if (hasTouch && !hasFineMouse) {
        setInputType('touch');
      } else if (hasFineMouse) {
        setInputType('mouse');
      }
    }

    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('pointermove', handlePointer);
    
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('pointermove', handlePointer);
    };
  }, [inputType]);

  return inputType;
}

/**
 * Hook that returns whether the user is primarily using touch input
 */
export function useIsTouchDevice(): boolean {
  const inputType = useInputType();
  return inputType === 'touch';
}