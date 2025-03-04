import React, { useState, useEffect } from 'react';
import { toolSongs, getFibonacciAnalysis, getFibonacciVisualData, getRecursiveFibonacciPatterns } from '@/utils/musicData';
import { Music, Play, Clock, Sigma, Info, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import AudioPlayer from './AudioPlayer';

const MusicAnalysis: React.FC = () => {
  const [selectedSong, setSelectedSong] = useState(toolSongs[0]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [recursionLevel, setRecursionLevel] = useState(1);
  const [expandedPatterns, setExpandedPatterns] = useState<string[]>([]);
  
  const analysis = getFibonacciAnalysis(selectedSong.id);
  const visualData = getFibonacciVisualData(selectedSong.id);
  const recursivePatterns = getRecursiveFibonacciPatterns(selectedSong.id);
  
  useEffect(() => {
    setExpandedPatterns([]);
  }, [selectedSong]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };
  
  const togglePatternExpand = (patternId: string) => {
    setExpandedPatterns(prev => 
      prev.includes(patternId) 
        ? prev.filter(id => id !== patternId)
        : [...prev, patternId]
    );
  };
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="font-heading text-xl text-golden mb-4">Tool Songs</h3>
          <div className="space-y-3 animate-stagger">
            {toolSongs.map((song) => (
              <div
                key={song.id}
                className={cn(
                  "tool-song-item",
                  selectedSong.id === song.id && "border-golden/50 bg-golden/10"
                )}
                onClick={() => {
                  setSelectedSong(song);
                  setShowAnalysis(false);
                  setTimeout(() => setShowAnalysis(true), 300);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded bg-dark-tertiary flex items-center justify-center">
                      <Music className="w-5 h-5 text-golden" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{song.title}</h4>
                      <p className="text-sm text-silver">{song.album} ({song.year})</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(song.duration)}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Complexity: 
                    <div className="inline-flex ml-2">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div 
                          key={i}
                          className={cn(
                            "w-1 h-3 mx-px rounded-sm",
                            i < song.complexity ? "bg-golden/70" : "bg-muted/30"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-golden">
                    <Sigma className="w-3 h-3 mr-1" />
                    {song.timeSignatures.length} patterns
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 glass-panel p-4 rounded-lg">
            <h4 className="text-silver font-medium mb-2">Pattern Recursion Depth</h4>
            <div className="flex items-center justify-between">
              <button 
                className="p-2 rounded-full bg-dark-tertiary text-silver hover:bg-golden/20 hover:text-golden transition-colors"
                onClick={() => setRecursionLevel(prev => Math.max(1, prev - 1))}
                disabled={recursionLevel <= 1}
              >
                <Minus size={16} />
              </button>
              <div className="text-golden font-medium text-lg">
                {recursionLevel}
              </div>
              <button 
                className="p-2 rounded-full bg-dark-tertiary text-silver hover:bg-golden/20 hover:text-golden transition-colors"
                onClick={() => setRecursionLevel(prev => Math.min(3, prev + 1))}
                disabled={recursionLevel >= 3}
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Adjust to explore deeper Fibonacci patterns
            </p>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div 
            className={cn(
              "transition-opacity duration-300",
              showAnalysis ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="glass-panel p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-heading text-white">{selectedSong.title}</h2>
                  <p className="text-silver">{selectedSong.album} ({selectedSong.year})</p>
                </div>
                <div className="glass-panel px-3 py-1 rounded-full flex items-center text-sm text-golden">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatTime(selectedSong.duration)}
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">{selectedSong.description}</p>
              
              {selectedSong.audioSrc && (
                <div className="mb-6">
                  <AudioPlayer 
                    audioSrc={selectedSong.audioSrc}
                    songDuration={selectedSong.duration}
                    fibonacciPoints={selectedSong.fibonacciMoments}
                    onTimeUpdate={handleTimeUpdate}
                  />
                </div>
              )}
              
              <div className="fibonacci-divider" />
              
              <h3 className="font-heading text-lg text-golden mb-3">Fibonacci Patterns</h3>
              {analysis && (
                <ul className="space-y-2">
                  {analysis.patterns.map((pattern, i) => (
                    <li key={i} className="flex items-start">
                      <Sigma className="w-4 h-4 text-golden mt-1 mr-2 flex-shrink-0" />
                      <span className="text-silver">{pattern}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const audioElement = document.querySelector('audio');
                                      if (audioElement) {
                                        audioElement.currentTime = pattern.startTime;
                                        audioElement.play();
                                      }
                                    }}
                                  >
                                    <Play size={12} className="mr-1" />
                                    Listen to this pattern
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
            
            <div className="glass-panel p-6">
              <h3 className="font-heading text-lg text-golden mb-3">Structural Timeline</h3>
              
              <div className="relative h-20 mb-6">
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-muted transform -translate-y-1/2" />
                
                {visualData && visualData.timePoints.map((point, i) => {
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
                {visualData && visualData.sections.map((section, i) => {
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicAnalysis;
