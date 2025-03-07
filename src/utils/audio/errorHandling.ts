
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
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(e => {
              console.error("Error playing audio:", e);
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
    }
  }
};
