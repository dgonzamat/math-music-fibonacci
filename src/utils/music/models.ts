
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
  spotifyUri?: string; // URI para abrir la canción en Spotify
}
