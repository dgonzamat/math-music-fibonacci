
import React from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import ProgressBar from './audio/ProgressBar';
import PlaybackControls from './audio/PlaybackControls';
import VolumeControl from './audio/VolumeControl';
import FibonacciPoints from './audio/FibonacciPoints';

interface AudioPlayerProps {
  audioSrc: string;
  songDuration: number; // in seconds
  fibonacciPoints: number[]; // timestamps in seconds
  onTimeUpdate?: (currentTime: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  songDuration,
  fibonacciPoints,
  onTimeUpdate
}) => {
  const {
    audioRef,
    isPlaying,
    currentTime,
    isMuted,
    volume,
    formatTime,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    handleSeek,
    skipToPoint,
    skipToPrevFibonacciPoint,
    skipToNextFibonacciPoint
  } = useAudioPlayer({
    audioSrc,
    songDuration,
    fibonacciPoints,
    onTimeUpdate
  });
  
  return (
    <div className="audio-player glass-panel p-4 rounded-lg">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      {/* Progress bar component */}
      <ProgressBar
        currentTime={currentTime}
        songDuration={songDuration}
        fibonacciPoints={fibonacciPoints}
        onSeek={handleSeek}
        formatTime={formatTime}
      />
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <PlaybackControls 
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onSkipPrev={skipToPrevFibonacciPoint}
          onSkipNext={skipToNextFibonacciPoint}
        />
        
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
        />
      </div>
      
      {/* Fibonacci points */}
      <FibonacciPoints
        fibonacciPoints={fibonacciPoints}
        currentTime={currentTime}
        onPointClick={skipToPoint}
        formatTime={formatTime}
      />
    </div>
  );
};

export default AudioPlayer;
