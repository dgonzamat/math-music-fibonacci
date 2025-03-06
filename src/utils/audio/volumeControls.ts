
/**
 * Handle volume change
 */
export const handleVolumeChange = (
  audioRef: React.RefObject<HTMLAudioElement>,
  setVolume: (volume: number) => void,
  newVolume: number
) => {
  setVolume(newVolume);
  if (audioRef.current) {
    audioRef.current.volume = newVolume;
  }
};

/**
 * Toggle mute state
 */
export const toggleMute = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isMuted: boolean,
  setIsMuted: (isMuted: boolean) => void
) => {
  if (audioRef.current) {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }
};
