'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface FireworksProps {
  onComplete?: () => void;
}

export function Fireworks({ onComplete }: FireworksProps) {
  useEffect(() => {
    const duration = 2400;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    // Ensure canvas has proper z-index by creating it with specific styling
    const ensureCanvasZIndex = () => {
      const canvases = document.querySelectorAll('canvas');
      canvases.forEach((canvas) => {
        canvas.style.zIndex = '9999';
        canvas.style.pointerEvents = 'none';
        canvas.style.position = 'fixed';
      });
    };

    const fireworks = () => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        if (onComplete) onComplete();
        return;
      }

      const particleCount = 30;

      confetti({
        particleCount,
        startVelocity: 20,
        spread: 180,
        origin: {
          x: randomInRange(0.3, 0.7),
          y: randomInRange(0.3, 0.7),
        },
        scalar: 0.7,
        zIndex: 9999,
      });

      // Ensure canvas styling after confetti creates it
      setTimeout(ensureCanvasZIndex, 10);

      requestAnimationFrame(fireworks);
    };

    fireworks();

    return () => {
      // Cleanup if needed
    };
  }, [onComplete]);

  return null;
}
