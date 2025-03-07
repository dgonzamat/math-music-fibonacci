
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
  // If using Spotify, just update the time for UI display
  if (useSpotify) {
    setCurrentTime(time);
    return;
  }
  
  if (audioRef.current) {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    
    if (!audioRef.current.paused) {
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(e => {
              console.error("Error playing audio after seeking:", e);
              
              // Try playing the fallback source if available
              if (audioRef.current && audioRef.current.src.includes('s3.amazonaws.com')) {
                // Try a fallback audio source with cors enabled
                const fallbackUrl = audioRef.current.src.replace('s3.amazonaws.com', 's3.us-east-1.amazonaws.com');
                audioRef.current.src = fallbackUrl;
                audioRef.current.currentTime = time;
                
                const retryPromise = audioRef.current.play();
                if (retryPromise !== undefined) {
                  retryPromise
                    .then(() => {
                      setIsPlaying(true);
                    })
                    .catch(retryError => {
                      console.error("Error playing fallback audio after seeking:", retryError);
                      if (spotifyUri) {
                        setError(true);
                        setUseSpotify(true);
                        setIsPlaying(false);
                      } else {
                        setError(true);
                        setIsPlaying(false);
                      }
                    });
                }
              } else if (spotifyUri) {
                setError(true);
                setUseSpotify(true);
                setIsPlaying(false);
              } else {
                setError(true);
                setIsPlaying(false);
              }
            });
        }
      } catch (e) {
        console.error("Exception playing audio after seeking:", e);
        if (spotifyUri) {
          setError(true);
          setUseSpotify(true);
          setIsPlaying(false);
        } else {
          setError(true);
          setIsPlaying(false);
        }
      }
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
