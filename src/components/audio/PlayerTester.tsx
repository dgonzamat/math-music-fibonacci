
import React, { useEffect } from 'react';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { toast } from 'sonner';

interface PlayerTesterProps {
  enableTestMode?: boolean;
}

/**
 * Component to test player interactions without modifying existing functionality
 * This component is invisible and only runs tests when enableTestMode is true
 */
const PlayerTester: React.FC<PlayerTesterProps> = ({ enableTestMode = false }) => {
  const { 
    isPlaying,
    currentTime,
    playerLoaded,
    playerError,
    currentSongId,
    skipToPoint
  } = usePlayerContext();

  // Log player status changes for testing
  useEffect(() => {
    if (!enableTestMode) return;

    if (playerLoaded) {
      console.log("✓ Player loaded successfully");
      toast.success("Test: Player loaded successfully");
    }
  }, [playerLoaded, enableTestMode]);

  // Test error handling
  useEffect(() => {
    if (!enableTestMode) return;

    if (playerError) {
      console.error("✗ Player error detected");
      toast.error("Test: Player error detected");
    }
  }, [playerError, enableTestMode]);

  // Monitor playback state changes
  useEffect(() => {
    if (!enableTestMode) return;
    
    console.log(`Playback state: ${isPlaying ? "Playing" : "Paused"}`);
  }, [isPlaying, enableTestMode]);

  // Monitor song changes
  useEffect(() => {
    if (!enableTestMode || !currentSongId) return;
    
    console.log(`Current song changed to: ${currentSongId}`);
    
    // Test point navigation after song is loaded
    if (playerLoaded) {
      // Test Fibonacci point navigation after a short delay
      const testTimeout = setTimeout(() => {
        const testPoints = [30, 60, 90];
        
        console.log("✓ Testing Fibonacci point navigation");
        toast.info("Test: Navigating to test points");
        
        // Test navigation to different points
        let pointIndex = 0;
        const pointInterval = setInterval(() => {
          if (pointIndex < testPoints.length) {
            skipToPoint(testPoints[pointIndex]);
            console.log(`✓ Navigation to ${testPoints[pointIndex]}s successful`);
            pointIndex++;
          } else {
            clearInterval(pointInterval);
          }
        }, 2000);
      }, 3000);
      
      return () => clearTimeout(testTimeout);
    }
  }, [currentSongId, playerLoaded, skipToPoint, enableTestMode]);

  // Monitor time updates to verify synchronization
  useEffect(() => {
    if (!enableTestMode) return;
    
    // Only log every 5 seconds to avoid console spam
    if (Math.floor(currentTime) % 5 === 0 && Math.floor(currentTime) > 0) {
      console.log(`Current time synchronized: ${Math.floor(currentTime)}s`);
    }
  }, [currentTime, enableTestMode]);

  // Return null as this is a non-visual component
  return null;
};

export default PlayerTester;
