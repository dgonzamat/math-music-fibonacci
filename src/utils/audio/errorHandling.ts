
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
  if (useSpotify && spotifyUri) {
    // Si estamos usando Spotify, abrimos la canción en Spotify
    window.open(spotifyUri, '_blank');
    return;
  }
  
  if (audioRef.current) {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error("Error playing audio:", e);
          setError(true);
          setUseSpotify(true);
        });
      }
    }
    setIsPlaying(!isPlaying);
  }
};
