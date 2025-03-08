
import { useState, useEffect } from 'react';
import { 
  handleVolumeChange as handleVolumeChangeUtil,
  toggleMute as toggleMuteUtil
} from '@/utils/audio/volumeControls';

interface UseAudioVolumeProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const useAudioVolume = ({ audioRef }: UseAudioVolumeProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  // Handle mute/unmute
  const toggleMute = () => {
    toggleMuteUtil(audioRef, isMuted, setIsMuted);
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    handleVolumeChangeUtil(audioRef, setVolume, newVolume);
  };

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  return {
    isMuted,
    volume,
    toggleMute,
    handleVolumeChange
  };
};
