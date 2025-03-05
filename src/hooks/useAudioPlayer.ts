
import { useState, useRef, useEffect } from 'react';

interface UseAudioPlayerProps {
  audioSrc: string;
  songDuration: number;
  fibonacciPoints: number[];
  onTimeUpdate?: (currentTime: number) => void;
}

export const useAudioPlayer = ({
  audioSrc,
  songDuration,
  fibonacciPoints,
  onTimeUpdate
}: UseAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Format time display (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle mute/unmute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Handle seeking
  const handleSeek = (seekTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  // Skip to specific Fibonacci point
  const skipToPoint = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Skip to previous/next Fibonacci point
  const skipToPrevFibonacciPoint = () => {
    const prevPoint = fibonacciPoints.filter(point => point < currentTime).pop();
    if (prevPoint !== undefined) {
      skipToPoint(prevPoint);
    } else if (fibonacciPoints.length > 0) {
      // If no previous point, go to the last point
      skipToPoint(fibonacciPoints[fibonacciPoints.length - 1]);
    }
  };
  
  const skipToNextFibonacciPoint = () => {
    const nextPoint = fibonacciPoints.find(point => point > currentTime);
    if (nextPoint !== undefined) {
      skipToPoint(nextPoint);
    } else if (fibonacciPoints.length > 0) {
      // If no next point, go back to the first point
      skipToPoint(fibonacciPoints[0]);
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
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.volume = volume;
    }
    
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [onTimeUpdate, volume]);

  return {
    audioRef,
    isPlaying,
    currentTime,
    isMuted,
    volume,
    formatTime,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    handleSeek,
    skipToPoint,
    skipToPrevFibonacciPoint,
    skipToNextFibonacciPoint
  };
};
