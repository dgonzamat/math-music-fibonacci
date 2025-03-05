
import React from 'react';
import { ToolSong } from '@/utils/music';
import { Clock, Music, Sigma } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SongListProps {
  songs: ToolSong[];
  selectedSong: ToolSong;
  onSelectSong: (song: ToolSong) => void;
  recursionLevel: number;
  onRecursionLevelChange: (level: number) => void;
}

const SongList: React.FC<SongListProps> = ({
  songs,
  selectedSong,
  onSelectSong,
  recursionLevel,
  onRecursionLevelChange,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="md:col-span-1">
      <h3 className="font-heading text-xl text-golden mb-4">Tool Songs</h3>
      <div className="space-y-3 animate-stagger">
        {songs.map((song) => (
          <div
            key={song.id}
            className={cn(
              "tool-song-item",
              selectedSong.id === song.id && "border-golden/50 bg-golden/10"
            )}
            onClick={() => onSelectSong(song)}
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
      
      <RecursionLevelControl 
        recursionLevel={recursionLevel} 
        onRecursionLevelChange={onRecursionLevelChange} 
      />
    </div>
  );
};

interface RecursionLevelControlProps {
  recursionLevel: number;
  onRecursionLevelChange: (level: number) => void;
}

const RecursionLevelControl: React.FC<RecursionLevelControlProps> = ({ 
  recursionLevel, 
  onRecursionLevelChange 
}) => {
  return (
    <div className="mt-6 glass-panel p-4 rounded-lg">
      <h4 className="text-silver font-medium mb-2">Pattern Recursion Depth</h4>
      <div className="flex items-center justify-between">
        <button 
          className="p-2 rounded-full bg-dark-tertiary text-silver hover:bg-golden/20 hover:text-golden transition-colors"
          onClick={() => onRecursionLevelChange(Math.max(1, recursionLevel - 1))}
          disabled={recursionLevel <= 1}
        >
          <span className="sr-only">Decrease recursion level</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
          </svg>
        </button>
        <div className="text-golden font-medium text-lg">
          {recursionLevel}
        </div>
        <button 
          className="p-2 rounded-full bg-dark-tertiary text-silver hover:bg-golden/20 hover:text-golden transition-colors"
          onClick={() => onRecursionLevelChange(Math.min(3, recursionLevel + 1))}
          disabled={recursionLevel >= 3}
        >
          <span className="sr-only">Increase recursion level</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Adjust to explore deeper Fibonacci patterns
      </p>
    </div>
  );
};

export default SongList;
