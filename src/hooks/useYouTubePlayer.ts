
import { useEffect, useRef, useState } from 'react';
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
  // Track if player is ready to accept commands
  const [playerReady, setPlayerReady] = useState(false);
  
  const { 
    setCurrentTime,
    setIsPlaying,
    isPlaying,
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
    
    const videoId = getYouTubeVideoId(songId);
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  // Play the video
  const playVideo = () => {
    if (playerRef.current && playerReady) {
      try {
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing video:", error);
        toast.error("Error al reproducir el video");
      }
    }
  };

  // Pause the video
  const pauseVideo = () => {
    if (playerRef.current && playerReady) {
      try {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch (error) {
        console.error("Error pausing video:", error);
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  // Handle player ready event
  const onYouTubePlayerReady = (event: any) => {
    setPlayerReady(true);
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
      const isPlayerPlaying = event.data === window.YT.PlayerState.PLAYING;
      setIsPlaying(isPlayerPlaying);
    }
  };

  // Handle player errors
  const onYouTubePlayerError = (event: any) => {
    console.error("YouTube player error:", event);
    setPlayerError(true);
    setPlayerLoaded(false);
    setPlayerReady(false);
    toast.error("Error al cargar el reproductor de YouTube");
    
    if (onPlayerError) onPlayerError();
  };
  
  // Initialize the YouTube player
  const initializePlayer = () => {
    if (!songId) return;
    
    const videoId = getYouTubeVideoId(songId);
    const playerContainer = document.getElementById('youtube-player');
    
    if (!playerContainer) {
      console.error("YouTube player container not found");
      return;
    }
    
    try {
      // Create new player instance
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId,
        height: '180',
        width: '100%',
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          controls: 1,
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

    // Function to run when YouTube API is ready
    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API ready, initializing player");
      initializePlayer();
    };

    // If YouTube API is already loaded, initialize player directly
    if (window.YT && window.YT.Player) {
      console.log("YouTube API already loaded, initializing player directly");
      initializePlayer();
    }

    return () => {
      // Clean up interval on unmount
      if (timeUpdateIntervalRef.current) {
        window.clearInterval(timeUpdateIntervalRef.current);
      }
      // Clean up player instance
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error("Error destroying YouTube player:", error);
        }
      }
    };
  }, [songId]);
  
  // Method to seek to a specific time
  const seekTo = (time: number) => {
    if (playerRef.current && playerReady) {
      try {
        console.log(`Seeking to ${time}s`);
        playerRef.current.seekTo(time, true);
        // Auto-play after seeking
        if (!isPlaying) {
          setTimeout(() => playVideo(), 300);
        }
      } catch (error) {
        console.error("Error seeking to time:", error);
        toast.error("Error al navegar a ese punto del video");
      }
    } else {
      console.warn("Player not ready for seeking to", time);
    }
  };
  
  return {
    playerRef,
    seekTo,
    getYouTubeFullUrl,
    playVideo,
    pauseVideo,
    togglePlayPause,
    playerReady
  };
};

// Add global type for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
