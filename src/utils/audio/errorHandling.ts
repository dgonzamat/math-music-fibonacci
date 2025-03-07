
/**
 * Handle playback errors
 * @param error - Error state
 * @param setUseSpotify - Function to update Spotify state
 */
export const switchToSpotify = (
  setError: (error: boolean) => void,
  setUseSpotify: (useSpotify: boolean) => void
) => {
  setUseSpotify(true);
  setError(false);
};

/**
 * Toggle play/pause with error handling
 */
export const togglePlayWithErrorHandling = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isPlaying: boolean,
  setIsPlaying: (isPlaying: boolean) => void,
  setError: (error: boolean) => void,
  setUseSpotify: (useSpotify: boolean) => void,
  useSpotify: boolean,
  spotifyUri?: string
) => {
  // If we're already using Spotify, don't attempt to play the audio
  if (useSpotify) {
    setIsPlaying(!isPlaying);
    return;
  }
  
  if (audioRef.current) {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      tryPlayWithFallback(
        audioRef,
        setIsPlaying,
        setError,
        setUseSpotify,
        spotifyUri
      );
    }
  }
};

/**
 * Try to play audio with fallback handling
 */
export const tryPlayWithFallback = (
  audioRef: React.RefObject<HTMLAudioElement>,
  setIsPlaying: (isPlaying: boolean) => void,
  setError: (error: boolean) => void,
  setUseSpotify: (useSpotify: boolean) => void,
  spotifyUri?: string
) => {
  if (!audioRef.current) return;
  
  try {
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(e => {
          console.error("Error playing audio:", e);
          handlePlaybackError(
            audioRef,
            setIsPlaying,
            setError,
            setUseSpotify,
            spotifyUri
          );
        });
    }
  } catch (e) {
    console.error("Exception playing audio:", e);
    if (spotifyUri) {
      setError(true);
      setUseSpotify(true);
      setIsPlaying(false);
    } else {
      setError(true);
      setIsPlaying(false);
    }
  }
};

/**
 * Handle playback errors with fallback options
 */
export const handlePlaybackError = (
  audioRef: React.RefObject<HTMLAudioElement>,
  setIsPlaying: (isPlaying: boolean) => void,
  setError: (error: boolean) => void,
  setUseSpotify: (useSpotify: boolean) => void,
  spotifyUri?: string
) => {
  // Try a fallback audio source with cors enabled
  if (audioRef.current && audioRef.current.src.includes('s3.amazonaws.com')) {
    const fallbackUrl = audioRef.current.src.replace('s3.amazonaws.com', 's3.us-east-1.amazonaws.com');
    audioRef.current.src = fallbackUrl;
    
    const retryPromise = audioRef.current.play();
    if (retryPromise !== undefined) {
      retryPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(retryError => {
          console.error("Error playing fallback audio:", retryError);
          setError(true);
          setIsPlaying(false);
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
};
