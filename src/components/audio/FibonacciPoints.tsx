
import React from 'react';
import { cn } from '@/lib/utils';

interface FibonacciPointsProps {
  fibonacciPoints: number[];
  currentTime: number;
  onPointClick: (time: number) => void;
  formatTime: (seconds: number) => string;
}

const FibonacciPoints: React.FC<FibonacciPointsProps> = ({
  fibonacciPoints,
  currentTime,
  onPointClick,
  formatTime
}) => {
  return (
    <div className="flex flex-wrap mt-4 gap-2">
      {fibonacciPoints.map((point, i) => (
        <button
          key={i}
          className={cn(
            "text-xs px-2 py-1 rounded-full transition-colors",
            Math.abs(currentTime - point) < 0.5 
              ? "bg-golden/30 text-white border border-golden/50" 
              : "bg-dark-tertiary hover:bg-golden/20 text-silver"
          )}
          onClick={() => onPointClick(point)}
        >
          {formatTime(point)}
        </button>
      ))}
    </div>
  );
};

export default FibonacciPoints;
