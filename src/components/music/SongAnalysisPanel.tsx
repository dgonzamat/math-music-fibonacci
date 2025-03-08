
import React from 'react';
import { ToolSong } from '@/utils/music';
import { Clock, Sigma, Music, Video, ExternalLink } from 'lucide-react';
import AudioPlayer from '../AudioPlayer';

interface SongAnalysisPanelProps {
  song: ToolSong;
  analysis: { patterns: string[], explanation: string } | null;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

const SongAnalysisPanel: React.FC<SongAnalysisPanelProps> = ({
  song,
  analysis,
  currentTime,
  onTimeUpdate
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to generate YouTube link based on song ID
  const getYouTubeLink = (songId: string): string => {
    switch (songId) {
      case 'lateralus':
        return 'https://www.youtube.com/watch?v=Y7JG63IuaWs';
      case 'schism':
        return 'https://www.youtube.com/watch?v=80RtBeB61LE';
      case 'fibonacci': // Forty Six & 2
        return 'https://www.youtube.com/watch?v=GIuZUCpm9hc';
      default:
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(`tool ${song.title} full song`)}`;
    }
  };

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-heading text-white">{song.title}</h2>
          <p className="text-silver">{song.album} ({song.year})</p>
        </div>
        <div className="glass-panel px-3 py-1 rounded-full flex items-center text-sm text-golden">
          <Clock className="w-4 h-4 mr-2" />
          {formatTime(song.duration)}
        </div>
      </div>
      
      <p className="text-muted-foreground mb-4">{song.description}</p>
      
      <div className="mb-6">
        <AudioPlayer 
          audioSrc={song.audioSrc || ''}
          songDuration={song.duration}
          fibonacciPoints={song.fibonacciMoments}
          onTimeUpdate={onTimeUpdate}
          spotifyUri={song.spotifyUri}
          songId={song.id}
        />
      </div>
      
      <div className="fibonacci-divider" />
      
      <h3 className="font-heading text-lg text-golden mb-3">Fibonacci Patterns</h3>
      {analysis && (
        <ul className="space-y-2">
          {analysis.patterns.map((pattern, i) => (
            <li key={i} className="flex items-start">
              <Sigma className="w-4 h-4 text-golden mt-1 mr-2 flex-shrink-0" />
              <span className="text-silver">{pattern}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SongAnalysisPanel;
