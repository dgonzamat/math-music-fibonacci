
import React from 'react';
import { Video, ExternalLink, Play, Pause } from 'lucide-react';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { cn } from '@/lib/utils';

interface YouTubePlayerContainerProps {
  playerLoaded: boolean;
  playerError: boolean;
  getYouTubeFullUrl: () => string;
  handleExternalLinkClick: () => void;
  togglePlayPause: () => void;
  isPlaying: boolean;
  playerReady: boolean;
  testId?: string;
}

const YouTubePlayerContainer: React.FC<YouTubePlayerContainerProps> = ({
  playerLoaded,
  playerError,
  getYouTubeFullUrl,
  handleExternalLinkClick,
  togglePlayPause,
  isPlaying,
  playerReady,
  testId = 'external-youtube-link'
}) => {
  return (
    <>
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
          onClick={handleExternalLinkClick}
          data-testid={testId}
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          <span>Ver en YouTube</span>
        </a>
      </div>
      
      <div className="youtube-player-wrapper relative w-full" style={{ minHeight: "180px" }}>
        {playerError ? (
          <div className="flex flex-col items-center justify-center h-40 bg-red-900/20 rounded-md p-2">
            <p className="text-sm text-red-400 mb-2">Error al cargar el reproductor de YouTube</p>
            <a 
              href={getYouTubeFullUrl()}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs flex items-center transition-colors"
              onClick={handleExternalLinkClick}
              data-testid="external-youtube-error-link"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Ver en YouTube
            </a>
          </div>
        ) : (
          <>
            <div 
              id="youtube-player" 
              className={cn(
                "rounded-md transition-opacity duration-300 w-full", 
                playerLoaded ? 'opacity-100' : 'opacity-0'
              )}
            ></div>
            
            {playerLoaded && playerReady && (
              <div className="mt-2 flex justify-center">
                <button
                  onClick={togglePlayPause}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors"
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                  data-testid="play-pause-button"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>
            )}
          </>
        )}
        
        {!playerLoaded && !playerError && (
          <div className="flex justify-center items-center h-40 bg-dark-tertiary/50 rounded-md animate-pulse">
            <Video className="w-6 h-6 text-purple-400 animate-bounce" />
          </div>
        )}
      </div>
    </>
  );
};

export default YouTubePlayerContainer;
