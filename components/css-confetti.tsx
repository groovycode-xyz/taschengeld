'use client';

import { useEffect, useState } from 'react';

interface CSSConfettiProps {
  onComplete?: () => void;
}

export function CSSConfetti({ onComplete }: CSSConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    color: string;
    left: number;
    delay: number;
    duration: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    console.log('CSS Confetti component mounted - starting animation');
    
    // Generate random particles
    const newParticles = [];
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4'];
    
    for (let i = 0; i < 150; i++) {
      newParticles.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        rotation: Math.random() * 360
      });
    }
    
    setParticles(newParticles);
    
    // Clean up after animation
    const timeout = setTimeout(() => {
      console.log('CSS Confetti animation complete');
      if (onComplete) onComplete();
    }, 2400);
    
    return () => {
      console.log('CSS Confetti component unmounting');
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <>
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 999999;
        }
        
        .confetti-particle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: currentColor;
          animation: confetti-fall linear forwards;
        }
      `}</style>
      
      <div className="confetti-container" aria-hidden="true">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="confetti-particle"
            style={{
              left: `${particle.left}%`,
              color: particle.color,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          />
        ))}
      </div>
    </>
  );
}