
import React, { useEffect, useRef } from 'react';
import { Music, ExternalLink, Video } from 'lucide-react';
import { toast } from 'sonner';
import FibonacciPoints from './FibonacciPoints';
import PlayerTester from './PlayerTester';
import { usePlayerContext } from '@/contexts/PlayerContext';

interface YouTubeMusicPlayerProps {
  fibonacciPoints: number[];
  songId?: string;
  testMode?: boolean;
}

const YouTubeMusicPlayer: React.FC<YouTubeMusicPlayerProps> = ({
  fibonacciPoints,
  songId,
  testMode = false
}) => {
  const { 
    formatTime, 
    currentTime, 
    setCurrentTime,
    setIsPlaying,
    skipToPoint, 
    playerLoaded, 
    setPlayerLoaded, 
    playerError, 
    setPlayerError,
    setCurrentSongId
  } = usePlayerContext();
  
  // Reference to store YouTube player instance
  const playerRef = useRef<any>(null);
  // Reference to store the timer for polling player time
  const timeUpdateIntervalRef = useRef<number | null>(null);
  // Track external link clicks for testing
  const linkClickTrackerRef = useRef<boolean>(false);
  
  // Update current song in context when songId changes
  useEffect(() => {
    if (songId) {
      setCurrentSongId(songId);
    }
  }, [songId, setCurrentSongId]);
  
  // Setup YouTube API and player
  useEffect(() => {
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
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError
        }
      });
    } catch (error) {
      console.error("Error initializing YouTube player:", error);
      setPlayerError(true);
      toast.error("Error al inicializar el reproductor de YouTube");
    }
  };

  // Handle player ready event
  const onPlayerReady = (event: any) => {
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
  };

  // Handle player state changes
  const onPlayerStateChange = (event: any) => {
    if (event && window.YT) {
      setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    }
  };

  // Handle player errors
  const onPlayerError = (event: any) => {
    console.error("YouTube player error:", event);
    setPlayerError(true);
    setPlayerLoaded(false);
    toast.error("Error al cargar el reproductor de YouTube");
  };
  
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

  // Jump to specific time point
  useEffect(() => {
    // When skipToPoint is called from FibonacciPoints or elsewhere
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        if (Math.abs(playerRef.current.getCurrentTime() - currentTime) > 0.5) {
          playerRef.current.seekTo(currentTime, true);
        }
      } catch (error) {
        console.error("Error seeking to time:", error);
      }
    }
  }, [currentTime]);

  // Track external link clicks
  const handleExternalLinkClick = () => {
    linkClickTrackerRef.current = true;
    
    if (testMode) {
      toast.success("Test: External YouTube link clicked");
      console.log("✓ External YouTube link clicked");
    }
  };

  return (
    <div className="bg-purple-500/10 p-3 rounded-lg mb-4">
      <div className="flex items-center justify-between text-purple-400 mb-2">
        <div className="flex items-center">
          <Video className="w-5 h-5 mr-2" />
          <span className="font-medium">Reproductor de YouTube</span>
        </div>
        <a 
          href={getYouTubeFullUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-xs text-purple-300 hover:text-purple-100 transition-colors"
          aria-label="Ver en YouTube"
          onClick={handleExternalLinkClick}
          data-testid="external-youtube-link"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          <span>Ver en YouTube</span>
        </a>
      </div>
      
      <div className="youtube-player w-full" style={{ minHeight: "80px" }}>
        {playerError ? (
          <div className="flex flex-col items-center justify-center h-20 bg-red-900/20 rounded-md p-2">
            <p className="text-sm text-red-400 mb-2">Error al cargar el reproductor de YouTube</p>
            <a 
              href={getYouTubeFullUrl()}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs flex items-center transition-colors"
              onClick={handleExternalLinkClick}
              data-testid="external-youtube-error-link"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Ver en YouTube
            </a>
          </div>
        ) : (
          <div id="youtube-player" className={`rounded-md transition-opacity duration-300 ${playerLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
        )}
        
        {!playerLoaded && !playerError && (
          <div className="flex justify-center items-center h-20 bg-dark-tertiary/50 rounded-md animate-pulse">
            <Video className="w-6 h-6 text-purple-400 animate-bounce" />
          </div>
        )}
      </div>
      
      {/* Fibonacci points for YouTube player */}
      <div className="mt-4">
        <FibonacciPoints
          fibonacciPoints={fibonacciPoints}
          currentTime={currentTime}
          onPointClick={skipToPoint}
          formatTime={formatTime}
          testMode={testMode}
        />
      </div>
      
      {/* Include the tester component (invisible) */}
      <PlayerTester enableTestMode={testMode} />
    </div>
  );
};

// Add global type for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default YouTubeMusicPlayer;
