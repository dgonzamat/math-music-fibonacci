
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
    setPlayerError
  } = usePlayerContext();
  
  // Track external link clicks for testing
  const linkClickTrackerRef = useRef<boolean>(false);
  
  const { seekTo, getYouTubeFullUrl } = useYouTubePlayer({
    songId,
    onPlayerReady: () => setPlayerLoaded(true),
    onPlayerError: () => {
      setPlayerError(true);
      setPlayerLoaded(false);
    }
  });
  
  // Jump to specific time point
  useEffect(() => {
    seekTo(currentTime);
  }, [currentTime, seekTo]);

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
      />
      
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

export default YouTubeMusicPlayer;
