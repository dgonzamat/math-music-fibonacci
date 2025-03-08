
import React, { useState, useEffect } from 'react';
import { 
  toolSongs, 
  getFibonacciAnalysis, 
  getFibonacciVisualData, 
  getRecursiveFibonacciPatterns 
} from '@/utils/music';
import { cn } from '@/lib/utils';
import SongList from './music/SongList';
import SongAnalysisPanel from './music/SongAnalysisPanel';
import RecursivePatterns from './music/RecursivePatterns';
import SongStructureTimeline from './music/SongStructureTimeline';
import { toast } from 'sonner';

const MusicAnalysis: React.FC = () => {
  const [selectedSong, setSelectedSong] = useState(toolSongs[0]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [recursionLevel, setRecursionLevel] = useState(1);
  const [expandedPatterns, setExpandedPatterns] = useState<string[]>([]);
  const [testMode, setTestMode] = useState(false);
  
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
    
    if (testMode) {
      console.log(`✓ Pattern ${patternId} expansion toggled`);
      toast.info(`Test: Pattern expanded/collapsed`);
    }
  };
  
  const handleSelectSong = (song: typeof selectedSong) => {
    setSelectedSong(song);
    setShowAnalysis(false);
    setTimeout(() => setShowAnalysis(true), 300);
    
    if (testMode) {
      console.log(`✓ Song selection changed to ${song.title}`);
      toast.success(`Test: Song changed to ${song.title}`);
    }
  };
  
  // Hidden keyboard shortcut to enable test mode (press 'T' three times quickly)
  useEffect(() => {
    let tKeyPresses = 0;
    let lastKeyTime = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 't') {
        const now = Date.now();
        if (now - lastKeyTime < 500) {
          tKeyPresses++;
        } else {
          tKeyPresses = 1;
        }
        lastKeyTime = now;
        
        if (tKeyPresses === 3) {
          setTestMode(prev => !prev);
          toast({
            title: testMode ? "Test mode disabled" : "Test mode enabled",
            description: testMode 
              ? "App will now run normally without test notifications" 
              : "App will now test all interactions and show test results"
          });
          console.log(testMode ? "Test mode disabled" : "Test mode enabled");
          tKeyPresses = 0;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testMode]);
  
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
              testMode={testMode}
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
              testMode={testMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicAnalysis;
