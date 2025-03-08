
import React, { useEffect } from 'react';
import { Music, ExternalLink, Video } from 'lucide-react';
import { toast } from 'sonner';
import FibonacciPoints from './FibonacciPoints';
import { usePlayerContext } from '@/contexts/PlayerContext';

interface YouTubeMusicPlayerProps {
  fibonacciPoints: number[];
  songId?: string;
}

const YouTubeMusicPlayer: React.FC<YouTubeMusicPlayerProps> = ({
  fibonacciPoints,
  songId
}) => {
  const { 
    formatTime, 
    currentTime, 
    skipToPoint, 
    playerLoaded, 
    setPlayerLoaded, 
    playerError, 
    setPlayerError,
    setCurrentSongId
  } = usePlayerContext();
  
  // Update current song in context when songId changes
  useEffect(() => {
    if (songId) {
      setCurrentSongId(songId);
    }
  }, [songId, setCurrentSongId]);
  
  // Get the direct YouTube embed URL based on the song ID
  const getYouTubeEmbedUrl = () => {
    switch (songId) {
      case 'lateralus':
        return 'https://www.youtube.com/embed/Y7JG63IuaWs';
      case 'schism':
        return 'https://www.youtube.com/embed/80RtBeB61LE';
      case 'fibonacci': // Forty Six & 2
        return 'https://www.youtube.com/embed/GIuZUCpm9hc';
      default:
        // Fallback to Lateralus if no match
        return 'https://www.youtube.com/embed/Y7JG63IuaWs';
    }
  };
  
  // Get the full YouTube URL for external link
  const getYouTubeFullUrl = () => {
    switch (songId) {
      case 'lateralus':
        return 'https://www.youtube.com/watch?v=Y7JG63IuaWs';
      case 'schism':
        return 'https://www.youtube.com/watch?v=80RtBeB61LE';
      case 'fibonacci': // Forty Six & 2
        return 'https://www.youtube.com/watch?v=GIuZUCpm9hc';
      default:
        return 'https://www.youtube.com/watch?v=Y7JG63IuaWs';
    }
  };
  
  // Handle when the iframe is loaded
  const handlePlayerLoad = () => {
    setPlayerLoaded(true);
    setPlayerError(false);
    toast.success("Reproductor de YouTube cargado");
  };
  
  // Handle load error
  const handlePlayerError = () => {
    console.error("Error loading YouTube player iframe");
    setPlayerError(true);
    setPlayerLoaded(false);
    toast.error("Error al cargar el reproductor de YouTube");
  };

  return (
    <div className="bg-purple-500/10 p-3 rounded-lg mb-4">
      <div className="flex items-center justify-between text-purple-400 mb-2">
        <div className="flex items-center">
          <Video className="w-5 h-5 mr-2" />
          <span className="font-medium">Reproductor de YouTube</span>
        </div>
        <a 
          href={getYouTubeFullUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-xs text-purple-300 hover:text-purple-100 transition-colors"
          aria-label="Ver en YouTube"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          <span>Ver en YouTube</span>
        </a>
      </div>
      
      <div className="youtube-player w-full" style={{ minHeight: "80px" }}>
        {playerError ? (
          <div className="flex flex-col items-center justify-center h-20 bg-red-900/20 rounded-md p-2">
            <p className="text-sm text-red-400 mb-2">Error al cargar el reproductor de YouTube</p>
            <a 
              href={getYouTubeFullUrl()}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs flex items-center transition-colors"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Ver en YouTube
            </a>
          </div>
        ) : (
          <iframe 
            src={getYouTubeEmbedUrl()} 
            width="100%" 
            height="180" 
            frameBorder="0" 
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
            onLoad={handlePlayerLoad}
            onError={handlePlayerError}
            className={`rounded-md transition-opacity duration-300 ${playerLoaded ? 'opacity-100' : 'opacity-0'}`}
            title="YouTube music player"
          ></iframe>
        )}
        
        {!playerLoaded && !playerError && (
          <div className="flex justify-center items-center h-20 bg-dark-tertiary/50 rounded-md animate-pulse">
            <Video className="w-6 h-6 text-purple-400 animate-bounce" />
          </div>
        )}
      </div>
      
      {/* Fibonacci points for YouTube player */}
      <div className="mt-4">
        <FibonacciPoints
          fibonacciPoints={fibonacciPoints}
          currentTime={currentTime}
          onPointClick={skipToPoint}
          formatTime={formatTime}
        />
      </div>
    </div>
  );
};

export default YouTubeMusicPlayer;
