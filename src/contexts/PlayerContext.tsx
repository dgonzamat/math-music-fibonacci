
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PlayerContextType {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  playerLoaded: boolean;
  setPlayerLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  playerError: boolean;
  setPlayerError: React.Dispatch<React.SetStateAction<boolean>>;
  formatTime: (seconds: number) => string;
  skipToPoint: (time: number) => void;
  currentSongId: string | undefined;
  setCurrentSongId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};

interface PlayerProviderProps {
  children: React.ReactNode;
  onTimeUpdate?: (time: number) => void;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ 
  children, 
  onTimeUpdate 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<string | undefined>(undefined);
  const [lastSkipTime, setLastSkipTime] = useState<number>(0);

  // Format time function
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Skip to specific time point (for UI updates and YouTube API)
  const skipToPoint = (time: number) => {
    setLastSkipTime(Date.now());
    setCurrentTime(time);
    if (onTimeUpdate) onTimeUpdate(time);
  };
  
  // Update parent component when time changes
  useEffect(() => {
    // Avoid duplicate updates when skipToPoint was just called
    if (Date.now() - lastSkipTime > 300) {
      if (onTimeUpdate) {
        onTimeUpdate(currentTime);
      }
    }
  }, [currentTime, onTimeUpdate, lastSkipTime]);

  const value = {
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    playerLoaded,
    setPlayerLoaded,
    playerError,
    setPlayerError,
    formatTime,
    skipToPoint,
    currentSongId,
    setCurrentSongId
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
