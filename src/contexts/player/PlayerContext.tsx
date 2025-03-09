
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerContextType, PlayerProviderProps } from './types';
import { formatTime } from './playerUtils';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

/**
 * Hook to use the player context
 */
export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};

/**
 * Provider component for player functionality
 */
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
  
  // Skip to specific time point (for UI updates and YouTube API)
  const skipToPoint = (time: number) => {
    if (isNaN(time)) {
      console.error("Invalid time value:", time);
      return;
    }
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
