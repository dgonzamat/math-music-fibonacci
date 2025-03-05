
import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipPrev: () => void;
  onSkipNext: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onSkipPrev,
  onSkipNext
}) => {
  return (
    <div className="flex items-center">
      {/* Skip to previous Fibonacci point */}
      <button 
        className="p-2 text-silver hover:text-golden transition-colors"
        onClick={onSkipPrev}
        title="Previous Fibonacci Point"
      >
        <SkipBack size={18} />
      </button>
      
      {/* Play/Pause button */}
      <button 
        className="p-3 bg-dark-tertiary rounded-full text-golden hover:text-white hover:bg-golden/20 transition-colors mx-2"
        onClick={onTogglePlay}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      
      {/* Skip to next Fibonacci point */}
      <button 
        className="p-2 text-silver hover:text-golden transition-colors"
        onClick={onSkipNext}
        title="Next Fibonacci Point"
      >
        <SkipForward size={18} />
      </button>
    </div>
  );
};

export default PlaybackControls;
