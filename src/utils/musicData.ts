export interface TimeSignature {
  numerator: number;
  denominator: number;
}

export interface SongSection {
  name: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  timeSignature: TimeSignature;
  hasFibonacciPattern: boolean;
  description: string;
}

export interface ToolSong {
  id: string;
  title: string;
  album: string;
  year: number;
  duration: number; // in seconds
  timeSignatures: TimeSignature[];
  sections: SongSection[];
  fibonacciMoments: number[]; // timestamps in seconds where Fibonacci patterns occur
  goldenRatioPoint: number; // timestamp in seconds representing the golden ratio point of the song
  description: string;
  complexity: number; // 1-10 scale of mathematical complexity
  imageUrl?: string;
  audioSrc?: string; // Sample audio for demonstration
}

// Sample data for Tool songs with mathematical analysis
export const toolSongs: ToolSong[] = [
  {
    id: "lateralus",
    title: "Lateralus",
    album: "Lateralus",
    year: 2001,
    duration: 562, // 9:22
    timeSignatures: [
      { numerator: 5, denominator: 8 },
      { numerator: 8, denominator: 8 },
      { numerator: 13, denominator: 8 }
    ],
    sections: [
      {
        name: "Introduction",
        startTime: 0,
        endTime: 67,
        timeSignature: { numerator: 5, denominator: 8 },
        hasFibonacciPattern: true,
        description: "The intro builds tension with a 5/8 rhythm, the first Fibonacci number in the song's sequence."
      },
      {
        name: "First Verse",
        startTime: 67,
        endTime: 156,
        timeSignature: { numerator: 8, denominator: 8 },
        hasFibonacciPattern: true,
        description: "The verse follows the Fibonacci rhythm structure with syllable counts: 1,1,2,3,5,8,13"
      },
      {
        name: "Chorus",
        startTime: 156,
        endTime: 232,
        timeSignature: { numerator: 13, denominator: 8 },
        hasFibonacciPattern: true,
        description: "The chorus employs a 13/8 time signature, continuing the Fibonacci sequence from the verse."
      },
      {
        name: "Instrumental Bridge",
        startTime: 232,
        endTime: 379,
        timeSignature: { numerator: 8, denominator: 8 },
        hasFibonacciPattern: true,
        description: "This section features spiraling patterns that mirror the mathematical spiral of the Fibonacci sequence."
      },
      {
        name: "Climax and Outro",
        startTime: 379,
        endTime: 562,
        timeSignature: { numerator: 5, denominator: 8 },
        hasFibonacciPattern: true,
        description: "Returns to the 5/8 rhythm, creating a circular structure that mirrors the golden spiral."
      }
    ],
    fibonacciMoments: [67, 156, 232, 379],
    goldenRatioPoint: 347, // ~5:47 into the song
    description: "Lateralus is perhaps Tool's most mathematically intricate song, explicitly built around the Fibonacci sequence. The syllable count of the verses follows the sequence (1,1,2,3,5,8,13), and the time signatures cycle through Fibonacci numbers (5/8, 8/8, 13/8). The song's structure itself represents a spiral, mirroring the golden spiral derived from Fibonacci numbers.",
    complexity: 10,
    imageUrl: "/src/assets/lateralus.jpg",
    audioSrc: "https://filesamples.com/samples/audio/mp3/sample3.mp3" // Sample audio for demonstration
  },
  {
    id: "schism",
    title: "Schism",
    album: "Lateralus",
    year: 2001,
    duration: 403, // 6:43
    timeSignatures: [
      { numerator: 5, denominator: 8 },
      { numerator: 7, denominator: 8 },
      { numerator: 3, denominator: 8 }
    ],
    sections: [
      {
        name: "Introduction",
        startTime: 0,
        endTime: 55,
        timeSignature: { numerator: 5, denominator: 8 },
        hasFibonacciPattern: true,
        description: "Opens with a complex 5/8 pattern that establishes mathematical tension."
      },
      {
        name: "Verse",
        startTime: 55,
        endTime: 144,
        timeSignature: { numerator: 7, denominator: 8 },
        hasFibonacciPattern: false,
        description: "Shifts to 7/8, creating a mathematical juxtaposition with the Fibonacci-based intro."
      },
      {
        name: "Chorus",
        startTime: 144,
        endTime: 188,
        timeSignature: { numerator: 3, denominator: 8 },
        hasFibonacciPattern: true,
        description: "Uses 3/8 time, the fourth number in the Fibonacci sequence."
      },
      {
        name: "Bridge",
        startTime: 188,
        endTime: 249,
        timeSignature: { numerator: 5, denominator: 8 },
        hasFibonacciPattern: true,
        description: "Returns to 5/8, continuing the Fibonacci pattern."
      },
      {
        name: "Outro",
        startTime: 249,
        endTime: 403,
        timeSignature: { numerator: 7, denominator: 8 },
        hasFibonacciPattern: false,
        description: "Complex outro that weaves between time signatures."
      }
    ],
    fibonacciMoments: [55, 144, 249],
    goldenRatioPoint: 249, // ~4:09 into the song
    description: "Schism features constantly changing time signatures that create mathematical complexity. While not as explicitly Fibonacci-based as Lateralus, it still incorporates the sequence in its structure and rhythmic patterns. The song's overall composition reflects mathematical division - fitting its lyrical theme of division and separation.",
    complexity: 8,
    imageUrl: "/src/assets/schism.jpg",
    audioSrc: "https://filesamples.com/samples/audio/mp3/sample2.mp3" // Sample audio for demonstration
  },
  {
    id: "fibonacci",
    title: "Fibonacci",
    album: "10,000 Days",
    year: 2006,
    duration: 480, // 8:00
    timeSignatures: [
      { numerator: 3, denominator: 4 },
      { numerator: 5, denominator: 8 },
      { numerator: 8, denominator: 8 }
    ],
    sections: [
      {
        name: "Introduction",
        startTime: 0,
        endTime: 89,
        timeSignature: { numerator: 3, denominator: 4 },
        hasFibonacciPattern: true,
        description: "Standard time signature but with rhythmic patterns that follow Fibonacci ratios."
      },
      {
        name: "First Section",
        startTime: 89,
        endTime: 177,
        timeSignature: { numerator: 5, denominator: 8 },
        hasFibonacciPattern: true,
        description: "Shifts to 5/8, incorporating the 5th Fibonacci number."
      },
      {
        name: "Middle Section",
        startTime: 177,
        endTime: 297,
        timeSignature: { numerator: 8, denominator: 8 },
        hasFibonacciPattern: true,
        description: "Evolves to 8/8, continuing the sequence and building tension."
      },
      {
        name: "Climax",
        startTime: 297,
        endTime: 421,
        timeSignature: { numerator: 5, denominator: 8 },
        hasFibonacciPattern: true,
        description: "Returns to 5/8 at precisely the golden ratio point of the song."
      },
      {
        name: "Outro",
        startTime: 421,
        endTime: 480,
        timeSignature: { numerator: 3, denominator: 4 },
        hasFibonacciPattern: true,
        description: "Concludes with a return to the original time signature, creating mathematical symmetry."
      }
    ],
    fibonacciMoments: [89, 177, 297, 421],
    goldenRatioPoint: 297, // ~4:57 into the song
    description: "This song demonstrates Tool's mastery of mathematical precision in music. The composition is structured around Fibonacci sequences and golden ratio proportions, with key changes and transitions occurring exactly at points determined by these mathematical principles. The rhythmic patterns and time signature changes create a spiral-like effect that mirrors the Fibonacci spiral.",
    complexity: 9,
    imageUrl: "/src/assets/fibonacci.jpg",
    audioSrc: "https://filesamples.com/samples/audio/mp3/sample1.mp3" // Sample audio for demonstration
  }
];

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
