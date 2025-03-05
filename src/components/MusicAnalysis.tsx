
import React, { useState, useEffect } from 'react';
import { toolSongs, getFibonacciAnalysis, getFibonacciVisualData, getRecursiveFibonacciPatterns } from '@/utils/musicData';
import { cn } from '@/lib/utils';
import SongList from './music/SongList';
import SongAnalysisPanel from './music/SongAnalysisPanel';
import RecursivePatterns from './music/RecursivePatterns';
import SongStructureTimeline from './music/SongStructureTimeline';

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
  
  const handleSelectSong = (song: typeof selectedSong) => {
    setSelectedSong(song);
    setShowAnalysis(false);
    setTimeout(() => setShowAnalysis(true), 300);
  };
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SongList 
          songs={toolSongs}
          selectedSong={selectedSong}
          onSelectSong={handleSelectSong}
          recursionLevel={recursionLevel}
          onRecursionLevelChange={setRecursionLevel}
        />
        
        <div className="md:col-span-2">
          <div 
            className={cn(
              "transition-opacity duration-300",
              showAnalysis ? "opacity-100" : "opacity-0"
            )}
          >
            <SongAnalysisPanel 
              song={selectedSong}
              analysis={analysis}
              currentTime={currentTime}
              onTimeUpdate={handleTimeUpdate}
            />
            
            <RecursivePatterns 
              recursivePatterns={recursivePatterns}
              recursionLevel={recursionLevel}
              expandedPatterns={expandedPatterns}
              togglePatternExpand={togglePatternExpand}
              currentTime={currentTime}
            />
            
            <SongStructureTimeline 
              visualData={visualData}
              selectedSong={selectedSong}
              currentTime={currentTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicAnalysis;
