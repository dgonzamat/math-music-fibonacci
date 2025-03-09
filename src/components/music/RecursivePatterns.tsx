
import React from 'react';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { toast } from 'sonner';

interface Pattern {
  startTime: number;
  endTime: number;
  description: string;
}

interface LevelData {
  level: number;
  patterns: Pattern[];
}

interface RecursivePatternsProps {
  recursivePatterns: LevelData[];
  recursionLevel: number;
  expandedPatterns: string[];
  togglePatternExpand: (patternId: string) => void;
  currentTime: number;
}

const RecursivePatterns: React.FC<RecursivePatternsProps> = ({
  recursivePatterns,
  recursionLevel,
  expandedPatterns,
  togglePatternExpand,
  currentTime
}) => {
  const { formatTime, skipToPoint } = usePlayerContext();

  const handlePlayPattern = (startTime: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Playing pattern at ${startTime}s`);
    skipToPoint(startTime);
    toast.success(`Reproduciendo desde ${formatTime(startTime)}`);
  };

  return (
    <div className="glass-panel p-6 mb-6">
      <h3 className="font-heading text-lg text-golden mb-3">Recursive Fibonacci Patterns</h3>
      <div className="space-y-4">
        {recursivePatterns
          .filter(levelData => levelData.level <= recursionLevel)
          .map((levelData, levelIndex) => (
            <div key={levelIndex} className="glass-panel p-3 border border-silver/10">
              <h4 className="text-white font-medium mb-2">
                Level {levelData.level}: {levelData.level === 1 ? 'Macro' : levelData.level === 2 ? 'Medium' : 'Micro'} Structure
              </h4>
              <div className="space-y-2">
                {levelData.patterns.map((pattern, i) => {
                  const patternId = `level-${levelData.level}-pattern-${i}`;
                  const isExpanded = expandedPatterns.includes(patternId);
                  const isActive = currentTime >= pattern.startTime && currentTime <= pattern.endTime;
                  
                  return (
                    <div 
                      key={i}
                      className={cn(
                        "p-2 rounded border transition-all duration-300",
                        isActive 
                          ? "border-golden/50 bg-golden/10" 
                          : "border-silver/10 hover:border-silver/30"
                      )}
                    >
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => togglePatternExpand(patternId)}
                      >
                        <div className="flex items-center text-sm">
                          <div 
                            className={cn(
                              "w-2 h-2 rounded-full mr-2",
                              isActive ? "bg-golden animate-pulse" : "bg-silver/50"
                            )}
                          />
                          <span>
                            {formatTime(pattern.startTime)} - {formatTime(pattern.endTime)}
                          </span>
                        </div>
                        <button className="text-silver hover:text-golden transition-colors">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      
                      {isExpanded && (
                        <div className="mt-2 text-xs text-silver pl-4 border-l border-silver/20">
                          <p>{pattern.description}</p>
                          <button 
                            className="mt-2 flex items-center text-golden hover:text-golden/80 transition-colors text-xs"
                            onClick={(e) => handlePlayPattern(pattern.startTime, e)}
                            data-testid={`play-pattern-${levelData.level}-${i}`}
                          >
                            <Play size={12} className="mr-1" />
                            Escuchar este patrón
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecursivePatterns;
