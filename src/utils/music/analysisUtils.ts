
import { ToolSong, SongSection } from './models';
import { toolSongs } from './songData';

export const getFibonacciAnalysis = (songId: string): {patterns: string[], explanation: string} | null => {
  const song = toolSongs.find(s => s.id === songId);
  if (!song) return null;
  
  return {
    patterns: [
      `Time signatures use Fibonacci numbers: ${song.timeSignatures.map(ts => `${ts.numerator}/${ts.denominator}`).join(', ')}`,
      `Golden ratio point occurs at ${Math.floor(song.goldenRatioPoint / 60)}:${Math.floor(song.goldenRatioPoint % 60).toString().padStart(2, '0')}`,
      `${song.sections.filter(s => s.hasFibonacciPattern).length} out of ${song.sections.length} sections follow Fibonacci patterns`,
      `Song structure mirrors the Fibonacci spiral in its intensity and complexity`,
      `Rhythmic patterns reflect mathematical proportions of the golden ratio`
    ],
    explanation: song.description
  };
};

export const getFibonacciVisualData = (songId: string): {timePoints: number[], sections: SongSection[]} | null => {
  const song = toolSongs.find(s => s.id === songId);
  if (!song) return null;
  
  return {
    timePoints: [
      0,
      ...song.fibonacciMoments,
      song.goldenRatioPoint,
      song.duration
    ].sort((a, b) => a - b),
    sections: song.sections
  };
};

export const getRecursiveFibonacciPatterns = (songId: string): { level: number; patterns: { startTime: number; endTime: number; description: string }[] }[] => {
  const song = toolSongs.find(s => s.id === songId);
  if (!song) return [];
  
  // Create multilevel patterns to demonstrate recursivity
  return [
    {
      level: 1, // Macro structure (major sections)
      patterns: song.sections.map(section => ({
        startTime: section.startTime,
        endTime: section.endTime,
        description: `${section.name}: ${section.description}`
      }))
    },
    {
      level: 2, // Medium structure (phrases)
      patterns: song.fibonacciMoments.map((moment, i, arr) => ({
        startTime: moment,
        endTime: arr[i + 1] || song.duration,
        description: `Fibonacci transition at ${Math.floor(moment / 60)}:${Math.floor(moment % 60).toString().padStart(2, '0')}`
      }))
    },
    {
      level: 3, // Micro structure (rhythmic patterns)
      patterns: Array.from({ length: 5 }, (_, i) => {
        const baseTime = song.fibonacciMoments[0] || 0;
        const startTime = baseTime + i * 8;
        return {
          startTime,
          endTime: startTime + 5,
          description: `Rhythmic pattern with Fibonacci syllable count`
        };
      })
    }
  ];
};
