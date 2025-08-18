'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface FireworksProps {
  onComplete?: () => void;
}

export function Fireworks({ onComplete }: FireworksProps) {
  useEffect(() => {
    console.log('Fireworks component mounted - starting confetti animation');

    // Use the default confetti (which creates its own canvas)
    // but run multiple bursts for better visibility
    const duration = 2400;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 999999,
      disableForReducedMotion: false,
      useWorker: false, // Disable worker to avoid CSP issues
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        console.log('Fireworks animation complete');
        clearInterval(interval);
        if (onComplete) onComplete();
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Since the library is loaded, create bursts from multiple origin points
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    // Also fire an immediate burst for instant feedback
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 999999,
    });

    // Cleanup
    return () => {
      console.log('Fireworks component unmounting - cleaning up');
      clearInterval(interval);
      confetti.reset();
    };
  }, [onComplete]);

  // Also render a div to ensure the component is in the DOM
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999999,
      }}
      aria-hidden='true'
    />
  );
}
