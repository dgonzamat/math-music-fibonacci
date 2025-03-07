
import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import ProgressBar from './audio/ProgressBar';
import PlaybackControls from './audio/PlaybackControls';
import VolumeControl from './audio/VolumeControl';
import FibonacciPoints from './audio/FibonacciPoints';
import { AlertCircle, Music, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

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

  // Estado para opciones alternativas
  const [showAlternativeOptions, setShowAlternativeOptions] = useState(false);
  const [spotifyEmbedLoaded, setSpotifyEmbedLoaded] = useState(false);
  const [spotifyError, setSpotifyError] = useState(false);
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
  
  // Preparar la URL de YouTube para embeber (alternativa a Spotify)
  const getYouTubeEmbedUrl = () => {
    const songTitle = spotifyUri?.includes('lateralus') 
      ? 'tool lateralus' 
      : spotifyUri?.includes('schism') 
        ? 'tool schism' 
        : 'tool forty six and 2';
    
    // Using YouTube search string in embed
    return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(songTitle)}`;
  };
  
  // Manejar cuando el iframe está cargado
  const handleAlternativePlayerLoad = () => {
    setSpotifyEmbedLoaded(true);
    setSpotifyError(false);
    toast.success("Reproductor alternativo cargado");
  };
  
  // Manejar error de carga
  const handleAlternativePlayerError = () => {
    console.error("Error loading alternative player iframe");
    setSpotifyError(true);
    setSpotifyEmbedLoaded(false);
    toast.error("Error al cargar el reproductor alternativo");
  };
  
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
            setIsPlaying(true);
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
        <div className="text-red-500 p-2 mb-3 bg-red-100/10 rounded flex flex-wrap items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span className="flex-1">Error al cargar el audio. </span>
          
          <button 
            onClick={retryAudioPlayback}
            className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs flex items-center"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reintentar
          </button>
          
          <button 
            onClick={tryAlternativeSource}
            className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs flex items-center"
          >
            <Music className="w-3 h-3 mr-1" />
            Fuente alternativa
          </button>
          
          <button 
            onClick={switchToSpotify}
            className="bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Reproductor alternativo
          </button>
        </div>
      ) : null}
      
      {useSpotify ? (
        <div className="bg-purple-500/10 p-3 rounded-lg mb-4">
          <div className="flex items-center text-purple-400 mb-2">
            <Music className="w-5 h-5 mr-2" />
            <span className="font-medium">Reproductor alternativo</span>
          </div>
          
          <div className="alternative-player w-full" style={{ minHeight: "80px" }}>
            {spotifyError ? (
              <div className="flex flex-col items-center justify-center h-20 bg-red-900/20 rounded-md p-2">
                <p className="text-sm text-red-400 mb-2">Error al cargar el reproductor alternativo</p>
                <div className="flex gap-2">
                  <a 
                    href={getYouTubeEmbedUrl()}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-xs flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ver en YouTube
                  </a>
                </div>
              </div>
            ) : (
              <iframe 
                src={getYouTubeEmbedUrl()} 
                width="100%" 
                height="80" 
                frameBorder="0" 
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"
                onLoad={handleAlternativePlayerLoad}
                onError={handleAlternativePlayerError}
                className={`rounded-md transition-opacity duration-300 ${spotifyEmbedLoaded ? 'opacity-100' : 'opacity-0'}`}
              ></iframe>
            )}
            
            {!spotifyEmbedLoaded && !spotifyError && (
              <div className="flex justify-center items-center h-20 bg-dark-tertiary/50 rounded-md animate-pulse">
                <Music className="w-6 h-6 text-purple-400 animate-bounce" />
              </div>
            )}
          </div>
          
          {/* Mantener los controles para ver los puntos de Fibonacci */}
          <div className="mt-4">
            <FibonacciPoints
              fibonacciPoints={fibonacciPoints}
              currentTime={currentTime}
              onPointClick={skipToPoint}
              formatTime={formatTime}
            />
          </div>
        </div>
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
