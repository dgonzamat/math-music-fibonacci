
import React from 'react';
import { SongSection } from '@/utils/musicData';
import { cn } from '@/lib/utils';

interface TimelinePoint {
  timePoints: number[];
  sections: SongSection[];
}

interface SongStructureTimelineProps {
  visualData: TimelinePoint | null;
  selectedSong: {
    duration: number;
    goldenRatioPoint: number;
  };
  currentTime: number;
}

const SongStructureTimeline: React.FC<SongStructureTimelineProps> = ({
  visualData,
  selectedSong,
  currentTime
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!visualData) return null;

  return (
    <div className="glass-panel p-6">
      <h3 className="font-heading text-lg text-golden mb-3">Structural Timeline</h3>
      
      <div className="relative h-20 mb-6">
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-muted transform -translate-y-1/2" />
        
        {visualData.timePoints.map((point, i) => {
          const position = (point / selectedSong.duration) * 100;
          const isGoldenPoint = Math.abs(point - selectedSong.goldenRatioPoint) < 1;
          const isCurrentTimeNear = Math.abs(point - currentTime) < 3;
          
          return (
            <div
              key={i}
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${position}%` }}
            >
              <div 
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  isCurrentTimeNear ? "scale-150" : "",
                  isGoldenPoint 
                    ? "bg-golden animate-pulse-soft" 
                    : "bg-silver/50"
                )}
                onClick={() => {
                  const audioElement = document.querySelector('audio');
                  if (audioElement) {
                    audioElement.currentTime = point;
                    audioElement.play();
                  }
                }}
              />
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
                <span className={cn(
                  "text-xs",
                  isGoldenPoint ? "text-golden" : "text-silver"
                )}>
                  {formatTime(point)}
                </span>
              </div>
            </div>
          );
        })}
        
        <div 
          className="absolute top-1/2 w-1 h-8 bg-white/80 transform -translate-y-1/2"
          style={{ left: `${(currentTime / selectedSong.duration) * 100}%` }}
        />
        
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 gold-shimmer"
          style={{ left: `${(selectedSong.goldenRatioPoint / selectedSong.duration) * 100}%` }}
        >
          <div className="w-4 h-4 rounded-full bg-golden/30 backdrop-blur-sm border border-golden/50" />
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <span className="text-xs glass-panel px-2 py-1 rounded-full text-golden">
              Golden Ratio Point
            </span>
          </div>
        </div>
      </div>
      
      <h3 className="font-heading text-lg text-golden mb-3">Song Sections</h3>
      <div className="space-y-3">
        {visualData.sections.map((section, i) => {
          const width = ((section.endTime - section.startTime) / selectedSong.duration) * 100;
          const left = (section.startTime / selectedSong.duration) * 100;
          const isCurrentSection = currentTime >= section.startTime && currentTime <= section.endTime;
          
          return (
            <div key={i} className="relative h-14">
              <div 
                className={cn(
                  "absolute h-full rounded glass-panel border transition-all duration-300",
                  isCurrentSection 
                    ? "border-golden/50 bg-golden/10 scale-y-110" 
                    : section.hasFibonacciPattern 
                      ? "border-golden/30 bg-golden/5" 
                      : "border-silver/10"
                )}
                style={{ 
                  left: `${left}%`, 
                  width: `${width}%` 
                }}
                onClick={() => {
                  const audioElement = document.querySelector('audio');
                  if (audioElement) {
                    audioElement.currentTime = section.startTime;
                    audioElement.play();
                  }
                }}
              >
                <div className="p-2 h-full flex flex-col justify-center overflow-hidden cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {section.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {section.timeSignature.numerator}/{section.timeSignature.denominator}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {formatTime(section.startTime)} - {formatTime(section.endTime)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SongStructureTimeline;
