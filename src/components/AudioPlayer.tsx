
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateFibonacciTimeIntervals } from '@/utils/fibonacci';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Generate Fibonacci time intervals for visualization
  const fibonacciIntervals = calculateFibonacciTimeIntervals(songDuration, 13);
  
  // Format time display (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle mute/unmute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Handle seeking
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const seekTime = pos * songDuration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  // Skip to specific Fibonacci point
  const skipToPoint = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Skip to previous/next Fibonacci point
  const skipToPrevFibonacciPoint = () => {
    const prevPoint = fibonacciPoints.filter(point => point < currentTime).pop();
    if (prevPoint !== undefined) {
      skipToPoint(prevPoint);
    } else if (fibonacciPoints.length > 0) {
      // If no previous point, go to the last point
      skipToPoint(fibonacciPoints[fibonacciPoints.length - 1]);
    }
  };
  
  const skipToNextFibonacciPoint = () => {
    const nextPoint = fibonacciPoints.find(point => point > currentTime);
    if (nextPoint !== undefined) {
      skipToPoint(nextPoint);
    } else if (fibonacciPoints.length > 0) {
      // If no next point, go back to the first point
      skipToPoint(fibonacciPoints[0]);
    }
  };
  
  // Update time display and progress
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        if (onTimeUpdate) onTimeUpdate(audio.currentTime);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.volume = volume;
    }
    
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [onTimeUpdate]);
  
  return (
    <div className="audio-player glass-panel p-4 rounded-lg">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      {/* Time display and progress bar */}
      <div className="mb-4 relative">
        <div 
          ref={progressRef}
          className="h-2 bg-dark-tertiary rounded-full cursor-pointer overflow-hidden"
          onClick={handleSeek}
        >
          {/* Progress bar */}
          <div 
            className="h-full bg-golden transition-all"
            style={{ width: `${(currentTime / songDuration) * 100}%` }}
          />
          
          {/* Fibonacci markers */}
          {fibonacciPoints.map((point, i) => (
            <div 
              key={i}
              className="absolute top-0 w-0.5 h-full bg-golden/70 backdrop-blur-sm"
              style={{ left: `${(point / songDuration) * 100}%` }}
              title={`Fibonacci Point at ${formatTime(point)}`}
            />
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-silver mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(songDuration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Skip to previous Fibonacci point */}
          <button 
            className="p-2 text-silver hover:text-golden transition-colors"
            onClick={skipToPrevFibonacciPoint}
            title="Previous Fibonacci Point"
          >
            <SkipBack size={18} />
          </button>
          
          {/* Play/Pause button */}
          <button 
            className="p-3 bg-dark-tertiary rounded-full text-golden hover:text-white hover:bg-golden/20 transition-colors mx-2"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          {/* Skip to next Fibonacci point */}
          <button 
            className="p-2 text-silver hover:text-golden transition-colors"
            onClick={skipToNextFibonacciPoint}
            title="Next Fibonacci Point"
          >
            <SkipForward size={18} />
          </button>
        </div>
        
        {/* Volume control */}
        <div className="flex items-center space-x-2">
          <button 
            className="text-silver hover:text-golden transition-colors"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 md:w-24 h-1 bg-dark-tertiary rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-golden"
          />
        </div>
      </div>
      
      {/* Fibonacci points list */}
      <div className="flex flex-wrap mt-4 gap-2">
        {fibonacciPoints.map((point, i) => (
          <button
            key={i}
            className={cn(
              "text-xs px-2 py-1 rounded-full transition-colors",
              Math.abs(currentTime - point) < 0.5 
                ? "bg-golden/30 text-white border border-golden/50" 
                : "bg-dark-tertiary hover:bg-golden/20 text-silver"
            )}
            onClick={() => skipToPoint(point)}
          >
            {formatTime(point)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AudioPlayer;
