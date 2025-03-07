
import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import ProgressBar from './audio/ProgressBar';
import PlaybackControls from './audio/PlaybackControls';
import VolumeControl from './audio/VolumeControl';
import FibonacciPoints from './audio/FibonacciPoints';
import SpotifyPlayer from './audio/SpotifyPlayer';
import ErrorDisplay from './audio/ErrorDisplay';
import { toast } from 'sonner';

interface AudioPlayerProps {
  audioSrc: string;
  songDuration: number; // in seconds
  fibonacciPoints: number[]; // timestamps in seconds
  onTimeUpdate?: (currentTime: number) => void;
  spotifyUri?: string;
  songId?: string; // Added songId prop
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  songDuration,
  fibonacciPoints,
  onTimeUpdate,
  spotifyUri,
  songId
}) => {
  // Generate fallback audio source 
  const getFallbackAudioSrc = (src: string) => {
    if (!src) return '';
    
    // Use different CDN or alternative domain
    if (src.includes('s3.amazonaws.com')) {
      return src.replace('s3.amazonaws.com', 's3.us-east-1.amazonaws.com');
    }
    
    // If it's a different source or format, provide a different fallback
    return src;
  };

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
    switchToSpotify,
    tryAlternativeSource,
    currentAudioSrc
  } = useAudioPlayer({
    audioSrc,
    songDuration,
    fibonacciPoints,
    onTimeUpdate,
    spotifyUri,
    fallbackAudioSrc: getFallbackAudioSrc(audioSrc)
  });

  // State for alternative options
  const [showAlternativeOptions, setShowAlternativeOptions] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const maxAttempts = 3;
  
  // Check for audio source on mount
  useEffect(() => {
    // Reset states on new audio source
    setCurrentAttempt(1);
    setShowAlternativeOptions(false);
    
    // If no audio source and has Spotify URI, switch to alternative
    if ((!audioSrc || audioSrc === '') && spotifyUri) {
      switchToSpotify();
    }
  }, [audioSrc, spotifyUri, switchToSpotify]);
  
  // Track error state to show alternatives
  useEffect(() => {
    if (error && currentAttempt <= maxAttempts) {
      setShowAlternativeOptions(true);
      setCurrentAttempt(prev => prev + 1);
    }
  }, [error, currentAttempt]);
  
  // Try a different approach for audio playback
  const retryAudioPlayback = () => {
    if (audioRef.current) {
      // Force reload the audio element
      const currentSrc = audioRef.current.src;
      audioRef.current.src = '';
      
      // Add cache-busting parameter
      const cacheBuster = `?cb=${Date.now()}`;
      audioRef.current.src = currentSrc.includes('?') 
        ? `${currentSrc}&cb=${Date.now()}`
        : `${currentSrc}${cacheBuster}`;
      
      // Try to play
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Notice we're using the hook's function, not a local state setter
            togglePlay();
            toast.success("Reproducción reiniciada");
          })
          .catch(e => {
            console.error("Error replaying audio:", e);
            tryAlternativeSource();
          });
      }
    }
  };
  
  return (
    <div className="audio-player glass-panel p-4 rounded-lg">
      {error && !useSpotify ? (
        <ErrorDisplay 
          onRetry={retryAudioPlayback}
          onTryAlternative={tryAlternativeSource}
          onSwitchToExternal={switchToSpotify}
        />
      ) : null}
      
      {useSpotify ? (
        <SpotifyPlayer
          formatTime={formatTime}
          fibonacciPoints={fibonacciPoints}
          currentTime={currentTime}
          skipToPoint={skipToPoint}
          songId={songId}
        />
      ) : (
        <>
          <audio 
            ref={audioRef} 
            src={audioSrc} 
            preload="metadata" 
            crossOrigin="anonymous"
          />
          
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
