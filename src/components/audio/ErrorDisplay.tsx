
import React from 'react';
import { AlertCircle, Music, ExternalLink, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  onRetry: () => void;
  onTryAlternative: () => void;
  onSwitchToExternal: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  onRetry,
  onTryAlternative,
  onSwitchToExternal
}) => {
  return (
    <div className="text-red-500 p-2 mb-3 bg-red-100/10 rounded flex flex-wrap items-center gap-2">
      <AlertCircle className="w-4 h-4" />
      <span className="flex-1">Error al cargar el audio. </span>
      
      <button 
        onClick={onRetry}
        className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs flex items-center"
      >
        <RefreshCw className="w-3 h-3 mr-1" />
        Reintentar
      </button>
      
      <button 
        onClick={onTryAlternative}
        className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs flex items-center"
      >
        <Music className="w-3 h-3 mr-1" />
        Fuente alternativa
      </button>
      
      <button 
        onClick={onSwitchToExternal}
        className="bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center"
      >
        <ExternalLink className="w-3 h-3 mr-1" />
        Reproductor alternativo
      </button>
    </div>
  );
};

export default ErrorDisplay;
