
/**
 * Generates a Fibonacci sequence up to the nth number
 */
export const generateFibonacciSequence = (n: number): number[] => {
  const sequence: number[] = [0, 1];
  if (n <= 1) return sequence.slice(0, n + 1);
  
  for (let i = 2; i <= n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  
  return sequence;
};

/**
 * Calculates the golden ratio (approximately 1.618...)
 */
export const goldenRatio = (): number => {
  return (1 + Math.sqrt(5)) / 2;
};

/**
 * Checks if a number is part of the Fibonacci sequence
 */
export const isFibonacciNumber = (num: number): boolean => {
  // A number is Fibonacci if and only if (5*n^2 + 4) or (5*n^2 - 4) is a perfect square
  const test1 = 5 * num * num + 4;
  const test2 = 5 * num * num - 4;
  
  const isPerfectSquare = (n: number): boolean => {
    const sqrt = Math.sqrt(n);
    return sqrt === Math.floor(sqrt);
  };
  
  return isPerfectSquare(test1) || isPerfectSquare(test2);
};

/**
 * Generates points for a Fibonacci spiral
 */
export const generateFibonacciSpiralPoints = (
  turns: number,
  pointsPerTurn: number = 20
): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  const phi = goldenRatio();
  const totalPoints = turns * pointsPerTurn;
  
  for (let i = 0; i < totalPoints; i++) {
    const angle = (i / pointsPerTurn) * Math.PI * 2;
    const radius = Math.pow(phi, (2 * i) / pointsPerTurn) / 50;
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    points.push({ x, y });
  }
  
  return points;
};

/**
 * Calculates Fibonacci time intervals in seconds
 * Useful for musical analysis where timing follows Fibonacci patterns
 */
export const calculateFibonacciTimeIntervals = (
  durationInSeconds: number,
  maxPoints: number = 8
): number[] => {
  const sequence = generateFibonacciSequence(maxPoints);
  const total = sequence.reduce((acc, val) => acc + val, 0);
  
  return sequence.map(num => (num / total) * durationInSeconds);
};

/**
 * Checks if a given time signature has a Fibonacci relationship
 */
export const hasFibonacciTimeSignature = (numerator: number, denominator: number): boolean => {
  return isFibonacciNumber(numerator) || isFibonacciNumber(denominator);
};

/**
 * Calculate the position for an element using the golden ratio
 * Useful for positioning elements in a visually pleasing way
 */
export const calculateGoldenPosition = (containerSize: number, isHorizontal: boolean = true): number => {
  const gr = goldenRatio();
  const smallerSection = containerSize / gr;
  
  return isHorizontal ? containerSize - smallerSection : smallerSection;
};
