
import React, { useRef } from 'react';

interface ProgressBarProps {
  currentTime: number;
  songDuration: number;
  fibonacciPoints: number[];
  onSeek: (seekTime: number) => void;
  formatTime: (seconds: number) => string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  songDuration,
  fibonacciPoints,
  onSeek,
  formatTime
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const seekTime = pos * songDuration;
      onSeek(seekTime);
    }
  };
  
  return (
    <div className="mb-4 relative">
      <div 
        ref={progressRef}
        className="h-2 bg-dark-tertiary rounded-full cursor-pointer overflow-hidden"
        onClick={handleSeek}
      >
        {/* Progress bar */}
        <div 
          className="h-full bg-golden transition-all"
          style={{ width: `${(currentTime / songDuration) * 100}%` }}
        />
        
        {/* Fibonacci markers */}
        {fibonacciPoints.map((point, i) => (
          <div 
            key={i}
            className="absolute top-0 w-0.5 h-full bg-golden/70 backdrop-blur-sm"
            style={{ left: `${(point / songDuration) * 100}%` }}
            title={`Fibonacci Point at ${formatTime(point)}`}
          />
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-silver mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(songDuration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
