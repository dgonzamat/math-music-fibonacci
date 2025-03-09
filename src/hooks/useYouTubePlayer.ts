
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { usePlayerContext } from '@/contexts/PlayerContext';

export interface YouTubePlayerHookProps {
  songId?: string;
  onPlayerReady?: () => void;
  onPlayerError?: () => void;
}

export const useYouTubePlayer = ({ 
  songId, 
  onPlayerReady, 
  onPlayerError 
}: YouTubePlayerHookProps) => {
  // Reference to store YouTube player instance
  const playerRef = useRef<any>(null);
  // Reference to store the timer for polling player time
  const timeUpdateIntervalRef = useRef<number | null>(null);
  
  const { 
    setCurrentTime,
    setIsPlaying,
    setPlayerLoaded, 
    setPlayerError,
    setCurrentSongId
  } = usePlayerContext();
  
  // Get the YouTube video ID based on the song ID
  const getYouTubeVideoId = (songId: string): string => {
    switch (songId) {
      case 'lateralus':
        return 'Y7JG63IuaWs';
      case 'schism':
        return '80RtBeB61LE';
      case 'fibonacci': // Forty Six & 2
        return 'GIuZUCpm9hc';
      default:
        return 'Y7JG63IuaWs'; // Default to Lateralus
    }
  };
  
  // Get the full YouTube URL for external link
  const getYouTubeFullUrl = () => {
    if (!songId) return 'https://www.youtube.com/watch?v=Y7JG63IuaWs';
    
    switch (songId) {
      case 'lateralus':
        return 'https://www.youtube.com/watch?v=Y7JG63IuaWs';
      case 'schism':
        return 'https://www.youtube.com/watch?v=80RtBeB61LE';
      case 'fibonacci': // Forty Six & 2
        return 'https://www.youtube.com/watch?v=GIuZUCpm9hc';
      default:
        return 'https://www.youtube.com/watch?v=Y7JG63IuaWs';
    }
  };

  // Handle player ready event
  const onYouTubePlayerReady = (event: any) => {
    setPlayerLoaded(true);
    setPlayerError(false);
    toast.success("Reproductor de YouTube cargado");
    
    // Start time update interval
    if (timeUpdateIntervalRef.current) {
      window.clearInterval(timeUpdateIntervalRef.current);
    }
    
    timeUpdateIntervalRef.current = window.setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          setCurrentTime(currentTime);
        } catch (error) {
          console.error("Error getting current time:", error);
        }
      }
    }, 250); // Update 4 times per second
    
    if (onPlayerReady) onPlayerReady();
  };

  // Handle player state changes
  const onYouTubePlayerStateChange = (event: any) => {
    if (event && window.YT) {
      setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    }
  };

  // Handle player errors
  const onYouTubePlayerError = (event: any) => {
    console.error("YouTube player error:", event);
    setPlayerError(true);
    setPlayerLoaded(false);
    toast.error("Error al cargar el reproductor de YouTube");
    
    if (onPlayerError) onPlayerError();
  };
  
  // Initialize the YouTube player
  const initializePlayer = () => {
    if (!songId) return;
    
    const videoId = getYouTubeVideoId(songId);
    const playerContainer = document.getElementById('youtube-player');
    
    if (!playerContainer) return;
    
    try {
      // Create new player instance
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId,
        height: '180',
        width: '100%',
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0
        },
        events: {
          'onReady': onYouTubePlayerReady,
          'onStateChange': onYouTubePlayerStateChange,
          'onError': onYouTubePlayerError
        }
      });
    } catch (error) {
      console.error("Error initializing YouTube player:", error);
      setPlayerError(true);
      toast.error("Error al inicializar el reproductor de YouTube");
    }
  };
  
  // Setup YouTube API and player
  useEffect(() => {
    // Update current song in context when songId changes
    if (songId) {
      setCurrentSongId(songId);
    }
    
    // Create YouTube API script if it doesn't exist
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = initializePlayer;

    // If YouTube API is already loaded, initialize player directly
    if (window.YT && window.YT.Player) {
      initializePlayer();
    }

    return () => {
      // Clean up interval on unmount
      if (timeUpdateIntervalRef.current) {
        window.clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [songId]);
  
  // Method to seek to a specific time
  const seekTo = (time: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        if (Math.abs(playerRef.current.getCurrentTime() - time) > 0.5) {
          playerRef.current.seekTo(time, true);
        }
      } catch (error) {
        console.error("Error seeking to time:", error);
      }
    }
  };
  
  return {
    playerRef,
    seekTo,
    getYouTubeFullUrl
  };
};

// Add global type for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
