
import React, { useState } from 'react';
import { Music, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import FibonacciPoints from './FibonacciPoints';

interface SpotifyPlayerProps {
  formatTime: (seconds: number) => string;
  fibonacciPoints: number[];
  currentTime: number;
  skipToPoint: (time: number) => void;
  songId?: string;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({
  formatTime,
  fibonacciPoints,
  currentTime,
  skipToPoint,
  songId
}) => {
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  
  // Get the correct YouTube URL based on the song ID
  const getYouTubeUrl = () => {
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
  
  // Handle when the iframe is loaded
  const handlePlayerLoad = () => {
    setPlayerLoaded(true);
    setPlayerError(false);
    toast.success("Reproductor alternativo cargado");
  };
  
  // Handle load error
  const handlePlayerError = () => {
    console.error("Error loading alternative player iframe");
    setPlayerError(true);
    setPlayerLoaded(false);
    toast.error("Error al cargar el reproductor alternativo");
  };

  return (
    <div className="bg-purple-500/10 p-3 rounded-lg mb-4">
      <div className="flex items-center text-purple-400 mb-2">
        <Music className="w-5 h-5 mr-2" />
        <span className="font-medium">Reproductor alternativo</span>
      </div>
      
      <div className="alternative-player w-full" style={{ minHeight: "80px" }}>
        {playerError ? (
          <div className="flex flex-col items-center justify-center h-20 bg-red-900/20 rounded-md p-2">
            <p className="text-sm text-red-400 mb-2">Error al cargar el reproductor alternativo</p>
            <div className="flex gap-2">
              <a 
                href={getYouTubeUrl()}
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
            src={getYouTubeUrl()} 
            width="100%" 
            height="180" 
            frameBorder="0" 
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
            onLoad={handlePlayerLoad}
            onError={handlePlayerError}
            className={`rounded-md transition-opacity duration-300 ${playerLoaded ? 'opacity-100' : 'opacity-0'}`}
          ></iframe>
        )}
        
        {!playerLoaded && !playerError && (
          <div className="flex justify-center items-center h-20 bg-dark-tertiary/50 rounded-md animate-pulse">
            <Music className="w-6 h-6 text-purple-400 animate-bounce" />
          </div>
        )}
      </div>
      
      {/* Fibonacci points for alternative player */}
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

export default SpotifyPlayer;
