
import { useState, useRef, useEffect } from 'react';
import { formatTime } from '@/utils/audio/formatTime';
import { 
  skipToPoint as skipToPointUtil,
  skipToPrevFibonacciPoint as skipToPrevUtil,
  skipToNextFibonacciPoint as skipToNextUtil 
} from '@/utils/audio/playbackControls';
import {
  switchToSpotify as switchToSpotifyUtil,
  togglePlayWithErrorHandling
} from '@/utils/audio/errorHandling';
import {
  handleVolumeChange as handleVolumeChangeUtil,
  toggleMute as toggleMuteUtil
} from '@/utils/audio/volumeControls';
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
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState(false);
  const [useSpotify, setUseSpotify] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState(audioSrc);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Handle play/pause
  const togglePlay = () => {
    togglePlayWithErrorHandling(
      audioRef,
      isPlaying,
      setIsPlaying,
      setError,
      setUseSpotify,
      useSpotify,
      spotifyUri
    );
  };
  
  // Switch to Spotify
  const switchToSpotify = () => {
    switchToSpotifyUtil(setError, setUseSpotify);
    toast.info("Cambiando a reproductor alternativo");
  };
  
  // Handle mute/unmute
  const toggleMute = () => {
    toggleMuteUtil(audioRef, isMuted, setIsMuted);
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    handleVolumeChangeUtil(audioRef, setVolume, newVolume);
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
    skipToPointUtil(
      audioRef,
      setCurrentTime,
      setIsPlaying,
      setError,
      setUseSpotify,
      time,
      useSpotify,
      spotifyUri
    );
  };
  
  // Skip to previous/next Fibonacci point
  const skipToPrevFibonacciPoint = () => {
    skipToPrevUtil(currentTime, fibonacciPoints, skipToPoint, useSpotify);
  };
  
  const skipToNextFibonacciPoint = () => {
    skipToNextUtil(currentTime, fibonacciPoints, skipToPoint, useSpotify);
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
  
  // Reset error when audio source changes
  useEffect(() => {
    setError(false);
    setUseSpotify(false);
    setCurrentAudioSrc(audioSrc);
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
      
      // Try fallback if available
      if (fallbackAudioSrc && currentAudioSrc !== fallbackAudioSrc) {
        toast.info("Intentando fuente alternativa...");
        tryAlternativeSource();
      }
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
  }, [onTimeUpdate, volume, fallbackAudioSrc, currentAudioSrc]);

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
    switchToSpotify,
    tryAlternativeSource,
    currentAudioSrc
  };
};
