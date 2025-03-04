
import React, { useState } from 'react';
import { toolSongs, getFibonacciAnalysis, getFibonacciVisualData } from '@/utils/musicData';
import { Music, Play, Clock, Sigma, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const MusicAnalysis: React.FC = () => {
  const [selectedSong, setSelectedSong] = useState(toolSongs[0]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const analysis = getFibonacciAnalysis(selectedSong.id);
  const visualData = getFibonacciVisualData(selectedSong.id);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            
            <div className="glass-panel p-6">
              <h3 className="font-heading text-lg text-golden mb-3">Structural Timeline</h3>
              
              <div className="relative h-20 mb-6">
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-muted transform -translate-y-1/2" />
                
                {visualData && visualData.timePoints.map((point, i) => {
                  const position = (point / selectedSong.duration) * 100;
                  const isGoldenPoint = Math.abs(point - selectedSong.goldenRatioPoint) < 1;
                  
                  return (
                    <div
                      key={i}
                      className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                      style={{ left: `${position}%` }}
                    >
                      <div 
                        className={cn(
                          "w-3 h-3 rounded-full",
                          isGoldenPoint 
                            ? "bg-golden animate-pulse-soft" 
                            : "bg-silver/50"
                        )}
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
                
                {/* Golden ratio marker */}
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
                  
                  return (
                    <div key={i} className="relative h-14">
                      <div 
                        className={cn(
                          "absolute h-full rounded glass-panel border",
                          section.hasFibonacciPattern 
                            ? "border-golden/30 bg-golden/5" 
                            : "border-silver/10"
                        )}
                        style={{ 
                          left: `${left}%`, 
                          width: `${width}%` 
                        }}
                      >
                        <div className="p-2 h-full flex flex-col justify-center overflow-hidden">
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
              
              <button className="mt-6 flex items-center space-x-2 glass-panel px-4 py-2 rounded-md border border-silver/10 text-silver hover:text-golden hover:border-golden/30 transition-colors duration-300">
                <Play className="w-4 h-4" />
                <span>Listen on Spotify</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicAnalysis;
