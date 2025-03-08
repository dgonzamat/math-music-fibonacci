
import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import YouTubeMusicPlayer from './audio/SpotifyPlayer';
import ErrorDisplay from './audio/ErrorDisplay';
import { toast } from 'sonner';

interface AudioPlayerProps {
  audioSrc: string;
  songDuration: number; // in seconds
  fibonacciPoints: number[]; // timestamps in seconds
  onTimeUpdate?: (currentTime: number) => void;
  spotifyUri?: string;
  songId?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  songDuration,
  fibonacciPoints,
  onTimeUpdate,
  spotifyUri,
  songId
}) => {
  // State to track if we're using YouTube
  const [useYouTube, setUseYouTube] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Format time function for timestamps
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Skip to specific time point in the song (for YouTube this is visual only)
  const skipToPoint = (time: number) => {
    setCurrentTime(time);
    if (onTimeUpdate) onTimeUpdate(time);
  };
  
  // Switch to YouTube player
  const switchToYouTube = () => {
    setUseYouTube(true);
    toast.success("Usando reproductor de YouTube");
  };
  
  // Always use YouTube player on mount
  useEffect(() => {
    setUseYouTube(true);
  }, []);
  
  return (
    <div className="audio-player glass-panel p-4 rounded-lg">
      <YouTubeMusicPlayer
        formatTime={formatTime}
        fibonacciPoints={fibonacciPoints}
        currentTime={currentTime}
        skipToPoint={skipToPoint}
        songId={songId}
      />
    </div>
  );
};

export default AudioPlayer;
