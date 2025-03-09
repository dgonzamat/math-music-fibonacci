
/**
 * Type definitions for the player context
 */

export interface PlayerContextType {
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

export interface PlayerProviderProps {
  children: React.ReactNode;
  onTimeUpdate?: (time: number) => void;
}
