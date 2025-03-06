
import { useState, useRef, useEffect } from 'react';

interface UseAudioPlayerProps {
  audioSrc: string;
  songDuration: number;
  fibonacciPoints: number[];
  onTimeUpdate?: (currentTime: number) => void;
  spotifyUri?: string;
}

export const useAudioPlayer = ({
  audioSrc,
  songDuration,
  fibonacciPoints,
  onTimeUpdate,
  spotifyUri
}: UseAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState(false);
  const [useSpotify, setUseSpotify] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Format time display (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle play/pause
  const togglePlay = () => {
    if (useSpotify && spotifyUri) {
      // Si estamos usando Spotify, abrimos la canción en Spotify
      window.open(spotifyUri, '_blank');
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Error playing audio:", e);
            setError(true);
            // Si hay un error, intentamos usar Spotify
            setUseSpotify(true);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Switch to Spotify
  const switchToSpotify = () => {
    setUseSpotify(true);
    setError(false);
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
    if (useSpotify && spotifyUri) {
      // Si estamos usando Spotify, solo abrimos Spotify
      window.open(spotifyUri, '_blank');
      return;
    }
    
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      if (!isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Error playing audio:", e);
            setError(true);
            setUseSpotify(true);
          });
        }
        setIsPlaying(true);
      }
    }
  };
  
  // Skip to previous/next Fibonacci point
  const skipToPrevFibonacciPoint = () => {
    if (useSpotify) return;
    
    const prevPoint = fibonacciPoints.filter(point => point < currentTime).pop();
    if (prevPoint !== undefined) {
      skipToPoint(prevPoint);
    } else if (fibonacciPoints.length > 0) {
      // If no previous point, go to the last point
      skipToPoint(fibonacciPoints[fibonacciPoints.length - 1]);
    }
  };
  
  const skipToNextFibonacciPoint = () => {
    if (useSpotify) return;
    
    const nextPoint = fibonacciPoints.find(point => point > currentTime);
    if (nextPoint !== undefined) {
      skipToPoint(nextPoint);
    } else if (fibonacciPoints.length > 0) {
      // If no next point, go back to the first point
      skipToPoint(fibonacciPoints[0]);
    }
  };
  
  // Reset error when audio source changes
  useEffect(() => {
    setError(false);
    setUseSpotify(false);
  }, [audioSrc]);
  
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
    
    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e);
      setError(true);
      setIsPlaying(false);
    };
    
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError as EventListener);
      audio.volume = volume;
    }
    
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError as EventListener);
      }
    };
  }, [onTimeUpdate, volume]);

  return {
    audioRef,
    isPlaying,
    currentTime,
    isMuted,
    volume,
    error,
    useSpotify,
    formatTime,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    handleSeek,
    skipToPoint,
    skipToPrevFibonacciPoint,
    skipToNextFibonacciPoint,
    switchToSpotify
  };
};
