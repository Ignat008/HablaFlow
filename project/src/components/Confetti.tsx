import { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
}

const colors = ['#FF7A00', '#FF4B4B', '#F5B500', '#FFD84D', '#FF9438'];

export function Confetti({ trigger }: ConfettiProps) {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    if (trigger) {
      const newPieces = Array.from({ length: 50 }, (_, i) => i);
      setPieces(newPieces);
      const timer = setTimeout(() => setPieces([]), 2600);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {pieces.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const color = colors[i % colors.length];
        const isCircle = i % 3 === 0;
        return (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              top: '-10px',
              backgroundColor: color,
              borderRadius: isCircle ? '50%' : '2px',
              animationDelay: `${delay}s`,
              width: isCircle ? '8px' : '10px',
              height: isCircle ? '8px' : '14px',
            }}
          />
        );
      })}
    </div>
  );
}
