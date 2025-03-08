
import { useState, useRef } from 'react';
import { useAudioTime } from './useAudioTime';
import { useAudioVolume } from './useAudioVolume';
import { useFibonacciNavigation } from './useFibonacciNavigation';
import { toast } from 'sonner';

interface UseAudioPlayerProps {
  audioSrc: string;
  songDuration: number;
  fibonacciPoints: number[];
  onTimeUpdate?: (currentTime: number) => void;
  spotifyUri?: string;
  fallbackAudioSrc?: string;
}

export const useAudioPlayer = ({
  audioSrc,
  songDuration,
  fibonacciPoints,
  onTimeUpdate,
  spotifyUri,
  fallbackAudioSrc
}: UseAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [useYouTube, setUseYouTube] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState(audioSrc);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Use the smaller hooks
  const { currentTime, setCurrentTime, handleSeek, formatTime } = useAudioTime({ 
    audioRef, 
    onTimeUpdate 
  });
  
  const { isMuted, volume, toggleMute, handleVolumeChange } = useAudioVolume({ 
    audioRef 
  });
  
  // Custom skipToPoint function for YouTube integration
  const skipToPoint = (time: number) => {
    // If using YouTube, just update the time for UI display
    if (useYouTube) {
      setCurrentTime(time);
      return;
    }
    
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const { skipToPrevFibonacciPoint, skipToNextFibonacciPoint } = useFibonacciNavigation({
    currentTime,
    fibonacciPoints,
    skipToPoint,
    useYouTube
  });
  
  // Switch to YouTube
  const switchToYouTube = () => {
    setUseYouTube(true);
    setError(false);
    toast.info("Cambiando a reproductor alternativo");
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    // For YouTube, just toggle the state
    if (useYouTube) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(e => {
                console.error("Error playing audio:", e);
                setError(true);
                setIsPlaying(false);
              });
          }
        } catch (e) {
          console.error("Exception playing audio:", e);
          setError(true);
          setIsPlaying(false);
        }
      }
    }
  };
  
  // Try alternative audio source
  const tryAlternativeSource = () => {
    if (audioRef.current && fallbackAudioSrc) {
      audioRef.current.src = fallbackAudioSrc;
      setCurrentAudioSrc(fallbackAudioSrc);
      setError(false);
      
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              toast.success("Usando fuente de audio alternativa");
            })
            .catch(e => {
              console.error("Error playing alternative audio:", e);
              setError(true);
              setIsPlaying(false);
              toast.error("Error al reproducir fuente alternativa");
            });
        }
      } catch (e) {
        console.error("Exception playing alternative audio:", e);
        setError(true);
        setIsPlaying(false);
      }
    } else {
      toast.error("No hay fuente alternativa disponible");
    }
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    isMuted,
    volume,
    error,
    useYouTube,
    formatTime,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    handleSeek,
    skipToPoint,
    skipToPrevFibonacciPoint,
    skipToNextFibonacciPoint,
    switchToYouTube,
    tryAlternativeSource,
    currentAudioSrc
  };
};
