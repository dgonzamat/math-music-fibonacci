
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { usePlayerContext } from '@/contexts/player';

interface FibonacciPointsProps {
  fibonacciPoints: number[];
  currentTime: number;
  onPointClick: (time: number) => void;
  formatTime: (seconds: number) => string;
  testMode?: boolean;
}

const FibonacciPoints: React.FC<FibonacciPointsProps> = ({
  fibonacciPoints,
  currentTime,
  onPointClick,
  formatTime,
  testMode = false
}) => {
  const clickedPointsRef = useRef<Set<number>>(new Set());
  const { skipToPoint } = usePlayerContext();

  const handlePointClick = (point: number) => {
    console.log(`Clicking on Fibonacci point: ${point}s`);
    // Notify the parent component
    onPointClick(point);
    
    // Also use the context for global synchronization
    skipToPoint(point);
    
    // Visual feedback
    toast.success(`Navegando a ${formatTime(point)}`);
    
    if (testMode) {
      clickedPointsRef.current.add(point);
      console.log(`✓ Fibonacci point ${formatTime(point)} clicked`);
      toast.info(`Test: Navigated to ${formatTime(point)}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {fibonacciPoints.map((point, i) => (
        <button
          key={i}
          className={cn(
            "text-xs px-2 py-1 rounded-full transition-colors",
            Math.abs(currentTime - point) < 0.5 
              ? "bg-golden/30 text-white border border-golden/50" 
              : "bg-dark-tertiary hover:bg-golden/20 text-silver"
          )}
          onClick={() => handlePointClick(point)}
          data-testid={`fibonacci-point-${i}`}
          data-time={point}
        >
          {formatTime(point)}
        </button>
      ))}
    </div>
  );
};

export default FibonacciPoints;
