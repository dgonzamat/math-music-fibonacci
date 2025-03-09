
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import FibonacciPoints from './FibonacciPoints';
import PlayerTester from './PlayerTester';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import YouTubePlayerContainer from './YouTubePlayerContainer';

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
    skipToPoint, 
    playerLoaded, 
    setPlayerLoaded, 
    playerError, 
    setPlayerError,
    isPlaying
  } = usePlayerContext();
  
  // Track external link clicks for testing
  const linkClickTrackerRef = useRef<boolean>(false);
  
  const { 
    seekTo, 
    getYouTubeFullUrl, 
    playerReady,
    togglePlayPause 
  } = useYouTubePlayer({
    songId,
    onPlayerReady: () => {
      setPlayerLoaded(true);
      console.log("Player ready callback executed");
    },
    onPlayerError: () => {
      setPlayerError(true);
      setPlayerLoaded(false);
      console.error("Player error callback executed");
    }
  });
  
  // Jump to specific time point
  useEffect(() => {
    if (playerReady) {
      seekTo(currentTime);
    }
  }, [currentTime]);

  // Handle Fibonacci point click
  const handleFibonacciPointClick = (time: number) => {
    console.log(`Fibonacci point clicked: ${time}s`);
    skipToPoint(time);
    
    // This ensures seekTo is actually called with the new time
    setTimeout(() => {
      seekTo(time);
    }, 50);
    
    if (testMode) {
      toast.success(`Navegando a ${formatTime(time)}`);
    }
  };

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
      <YouTubePlayerContainer 
        playerLoaded={playerLoaded}
        playerError={playerError}
        getYouTubeFullUrl={getYouTubeFullUrl}
        handleExternalLinkClick={handleExternalLinkClick}
        togglePlayPause={togglePlayPause}
        isPlaying={isPlaying}
        playerReady={playerReady}
      />
      
      {/* Fibonacci points for YouTube player */}
      <div className="mt-4">
        <h3 className="text-sm text-golden mb-2 font-medium">Puntos Fibonacci:</h3>
        <FibonacciPoints
          fibonacciPoints={fibonacciPoints}
          currentTime={currentTime}
          onPointClick={handleFibonacciPointClick}
          formatTime={formatTime}
          testMode={testMode}
        />
      </div>
      
      {/* Include the tester component (invisible) */}
      <PlayerTester enableTestMode={testMode} />
    </div>
  );
};

export default YouTubeMusicPlayer;
