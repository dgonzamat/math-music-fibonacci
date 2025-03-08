
import { 
  skipToPrevFibonacciPoint as skipToPrevUtil,
  skipToNextFibonacciPoint as skipToNextUtil 
} from '@/utils/audio/playbackControls';

interface UseFibonacciNavigationProps {
  currentTime: number;
  fibonacciPoints: number[];
  skipToPoint: (time: number) => void;
  useYouTube: boolean;
}

export const useFibonacciNavigation = ({
  currentTime,
  fibonacciPoints,
  skipToPoint,
  useYouTube
}: UseFibonacciNavigationProps) => {
  
  // Skip to previous/next Fibonacci point
  const skipToPrevFibonacciPoint = () => {
    skipToPrevUtil(currentTime, fibonacciPoints, skipToPoint, useYouTube);
  };
  
  const skipToNextFibonacciPoint = () => {
    skipToNextUtil(currentTime, fibonacciPoints, skipToPoint, useYouTube);
  };

  return {
    skipToPrevFibonacciPoint,
    skipToNextFibonacciPoint
  };
};
