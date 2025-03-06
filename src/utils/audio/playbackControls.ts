
/**
 * Handles skipping to a specific Fibonacci point
 * @param audioRef - Reference to the audio element
 * @param setCurrentTime - Function to update current time
 * @param setIsPlaying - Function to update playing state
 * @param setError - Function to update error state
 * @param setUseSpotify - Function to update Spotify state
 * @param time - Time to skip to
 * @param useSpotify - Whether Spotify is being used
 * @param spotifyUri - URI for Spotify playback
 */
export const skipToPoint = (
  audioRef: React.RefObject<HTMLAudioElement>,
  setCurrentTime: (time: number) => void,
  setIsPlaying: (isPlaying: boolean) => void,
  setError: (error: boolean) => void,
  setUseSpotify: (useSpotify: boolean) => void,
  time: number,
  useSpotify: boolean,
  spotifyUri?: string
) => {
  // We don't open Spotify anymore, we'll handle playback in the component
  
  if (audioRef.current) {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    if (!audioRef.current.paused) {
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

/**
 * Skip to previous Fibonacci point
 */
export const skipToPrevFibonacciPoint = (
  currentTime: number,
  fibonacciPoints: number[],
  skipToPointFn: (time: number) => void,
  useSpotify: boolean
) => {
  // Allow skipping even with Spotify
  
  const prevPoint = fibonacciPoints.filter(point => point < currentTime).pop();
  if (prevPoint !== undefined) {
    skipToPointFn(prevPoint);
  } else if (fibonacciPoints.length > 0) {
    // If no previous point, go to the last point
    skipToPointFn(fibonacciPoints[fibonacciPoints.length - 1]);
  }
};

/**
 * Skip to next Fibonacci point
 */
export const skipToNextFibonacciPoint = (
  currentTime: number,
  fibonacciPoints: number[],
  skipToPointFn: (time: number) => void,
  useSpotify: boolean
) => {
  // Allow skipping even with Spotify
  
  const nextPoint = fibonacciPoints.find(point => point > currentTime);
  if (nextPoint !== undefined) {
    skipToPointFn(nextPoint);
  } else if (fibonacciPoints.length > 0) {
    // If no next point, go back to the first point
    skipToPointFn(fibonacciPoints[0]);
  }
};
