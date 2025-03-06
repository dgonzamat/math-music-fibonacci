import React from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import ProgressBar from './audio/ProgressBar';
import PlaybackControls from './audio/PlaybackControls';
import VolumeControl from './audio/VolumeControl';
import FibonacciPoints from './audio/FibonacciPoints';
import { AlertCircle, Music } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc: string;
  songDuration: number; // in seconds
  fibonacciPoints: number[]; // timestamps in seconds
  onTimeUpdate?: (currentTime: number) => void;
  spotifyUri?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  songDuration,
  fibonacciPoints,
  onTimeUpdate,
  spotifyUri
}) => {
  const {
    audioRef,
    isPlaying,
    currentTime,
    isMuted,
    volume,
    error,
    useSpotify,
    formatTime,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    handleSeek,
    skipToPoint,
    skipToPrevFibonacciPoint,
    skipToNextFibonacciPoint,
    switchToSpotify
  } = useAudioPlayer({
    audioSrc,
    songDuration,
    fibonacciPoints,
    onTimeUpdate,
    spotifyUri
  });
  
  return (
    <div className="audio-player glass-panel p-4 rounded-lg">
      {error && !useSpotify ? (
        <div className="text-red-500 p-2 mb-3 bg-red-100/10 rounded flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="flex-1">Error al cargar el audio. </span>
          <button 
            onClick={switchToSpotify}
            className="ml-2 bg-[#1DB954] text-white px-3 py-1 rounded-full text-xs flex items-center"
          >
            <Music className="w-3 h-3 mr-1" />
            Usar Spotify
          </button>
        </div>
      ) : null}
      
      {useSpotify ? (
        <div className="bg-[#1DB954]/10 p-3 rounded-lg mb-4">
          <div className="flex items-center text-[#1DB954]">
            <Music className="w-5 h-5 mr-2" />
            <span className="font-medium">Escuchar en Spotify</span>
          </div>
          <p className="text-sm text-silver mt-1">
            Haz clic en el botón de reproducción para abrir Spotify y escuchar esta canción.
          </p>
          <button
            onClick={togglePlay}
            className="mt-2 bg-[#1DB954] text-white px-4 py-2 rounded-md flex items-center"
          >
            <Music className="w-4 h-4 mr-2" />
            Abrir en Spotify
          </button>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default AudioPlayer;
