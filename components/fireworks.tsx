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
      });

      requestAnimationFrame(fireworks);
    };

    fireworks();

    return () => {
      // Cleanup if needed
    };
  }, [onComplete]);

  return null;
}
