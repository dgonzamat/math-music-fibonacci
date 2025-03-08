
import React from 'react';
import YouTubeMusicPlayer from './audio/YouTubeMusicPlayer';
import ErrorDisplay from './audio/ErrorDisplay';
import { PlayerProvider } from '@/contexts/PlayerContext';

interface AudioPlayerProps {
  audioSrc: string;
  songDuration: number; // in seconds
  fibonacciPoints: number[]; // timestamps in seconds
  onTimeUpdate?: (currentTime: number) => void;
  spotifyUri?: string;
  songId?: string;
  testMode?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  songDuration,
  fibonacciPoints,
  onTimeUpdate,
  spotifyUri,
  songId,
  testMode = false
}) => {
  return (
    <div className="audio-player glass-panel p-4 rounded-lg">
      <PlayerProvider onTimeUpdate={onTimeUpdate}>
        <YouTubeMusicPlayer
          fibonacciPoints={fibonacciPoints}
          songId={songId}
          testMode={testMode}
        />
      </PlayerProvider>
    </div>
  );
};

export default AudioPlayer;
