
import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import ProgressBar from './audio/ProgressBar';
import PlaybackControls from './audio/PlaybackControls';
import VolumeControl from './audio/VolumeControl';
import FibonacciPoints from './audio/FibonacciPoints';
import { AlertCircle, Music } from 'lucide-react';
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

  // Estado para el iframe de Spotify
  const [spotifyEmbedLoaded, setSpotifyEmbedLoaded] = useState(false);
  const [spotifyError, setSpotifyError] = useState(false);
  
  // Check for audio source on mount
  useEffect(() => {
    // If no audio source and has Spotify URI, switch to Spotify
    if ((!audioSrc || audioSrc === '') && spotifyUri) {
      switchToSpotify();
    }
  }, [audioSrc, spotifyUri, switchToSpotify]);
  
  // Preparar la URL de Spotify para embeber
  const getSpotifyEmbedUrl = () => {
    if (!spotifyUri) return '';
    
    // Verificar si el URI ya es una URL completa
    if (spotifyUri.startsWith('https://')) {
      return spotifyUri;
    }
    
    // Convertir URI (spotify:track:1234567) a formato embebido (https://open.spotify.com/embed/track/1234567)
    const parts = spotifyUri.split(':');
    if (parts.length >= 3) {
      return `https://open.spotify.com/embed/${parts[1]}/${parts[2]}?utm_source=generator`;
    }
    return '';
  };
  
  // Manejar cuando el iframe está cargado
  const handleSpotifyLoad = () => {
    setSpotifyEmbedLoaded(true);
    setSpotifyError(false);
    toast.success("Spotify player loaded");
  };
  
  // Manejar error de carga de Spotify
  const handleSpotifyError = () => {
    console.error("Error loading Spotify iframe");
    setSpotifyError(true);
    setSpotifyEmbedLoaded(false);
    toast.error("Error loading Spotify player");
  };
  
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
          <div className="flex items-center text-[#1DB954] mb-2">
            <Music className="w-5 h-5 mr-2" />
            <span className="font-medium">Reproducir con Spotify</span>
          </div>
          
          {spotifyUri && (
            <div className="spotify-embed w-full" style={{ minHeight: "80px" }}>
              {spotifyError ? (
                <div className="flex flex-col items-center justify-center h-20 bg-red-900/20 rounded-md p-2">
                  <p className="text-sm text-red-400 mb-2">Error al cargar el reproductor de Spotify</p>
                  <a 
                    href={spotifyUri.startsWith('spotify:') ? `https://open.spotify.com/track/${spotifyUri.split(':')[2]}` : spotifyUri}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1DB954] text-white px-3 py-1 rounded-full text-xs flex items-center"
                  >
                    <Music className="w-3 h-3 mr-1" />
                    Abrir en Spotify
                  </a>
                </div>
              ) : (
                <iframe 
                  src={getSpotifyEmbedUrl()} 
                  width="100%" 
                  height="80" 
                  frameBorder="0" 
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  onLoad={handleSpotifyLoad}
                  onError={handleSpotifyError}
                  className={`rounded-md transition-opacity duration-300 ${spotifyEmbedLoaded ? 'opacity-100' : 'opacity-0'}`}
                ></iframe>
              )}
              
              {!spotifyEmbedLoaded && !spotifyError && (
                <div className="flex justify-center items-center h-20 bg-dark-tertiary/50 rounded-md animate-pulse">
                  <Music className="w-6 h-6 text-[#1DB954] animate-bounce" />
                </div>
              )}
            </div>
          )}
          
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
