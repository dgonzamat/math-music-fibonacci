
import { useState, useRef, useEffect } from 'react';
import { formatTime } from '@/utils/audio/formatTime';

interface UseAudioTimeProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  onTimeUpdate?: (currentTime: number) => void;
}

export const useAudioTime = ({ audioRef, onTimeUpdate }: UseAudioTimeProps) => {
  const [currentTime, setCurrentTime] = useState(0);

  // Handle seeking
  const handleSeek = (seekTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Update time display and progress
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        if (onTimeUpdate) onTimeUpdate(audio.currentTime);
      }
    };
    
    const handleEnded = () => {
      setCurrentTime(0);
    };
    
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [onTimeUpdate, audioRef]);

  return {
    currentTime,
    setCurrentTime,
    handleSeek,
    formatTime
  };
};
