
import React, { useEffect, useRef, useState } from 'react';
import { generateFibonacciSequence, generateFibonacciSpiralPoints } from '@/utils/fibonacci';
import { cn } from '@/lib/utils';

interface FibonacciVisualizerProps {
  turns: number;
  interactive?: boolean;
  className?: string;
  highlightNumbers?: number[];
  showNumbers?: boolean;
  animateIn?: boolean;
}

const FibonacciVisualizer: React.FC<FibonacciVisualizerProps> = ({
  turns = 5,
  interactive = true,
  className,
  highlightNumbers = [],
  showNumbers = true,
  animateIn = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(animateIn);
  const [hoverPoint, setHoverPoint] = useState<number | null>(null);
  const [sequence] = useState(generateFibonacciSequence(12));
  
  // Generate points for the spiral
  const drawSpiral = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const spiralPoints = generateFibonacciSpiralPoints(turns, 50);
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) * 0.45;
    
    // Draw the spiral
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 1.5;
    
    spiralPoints.forEach((point, index) => {
      const x = centerX + point.x * scale;
      const y = centerY + point.y * scale;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw Fibonacci squares
    const fibSequence = generateFibonacciSequence(turns + 2);
    let currentX = centerX - ((fibSequence[fibSequence.length - 2] / 4) * scale);
    let currentY = centerY - ((fibSequence[fibSequence.length - 2] / 4) * scale);
    
    for (let i = 1; i < fibSequence.length - 1; i++) {
      const size = (fibSequence[i] / 10) * scale;
      
      ctx.beginPath();
      ctx.rect(currentX, currentY, size, size);
      ctx.strokeStyle = 'rgba(192, 192, 192, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Adjust for next square
      if (i % 4 === 1) {
        currentX += size;
      } else if (i % 4 === 2) {
        currentY += size;
        currentX -= size;
      } else if (i % 4 === 3) {
        currentX -= size;
        currentY -= size;
      } else {
        currentY -= size;
      }
    }
    
    // Draw accent points
    spiralPoints
      .filter((_, i) => i % 50 === 0)
      .forEach((point, index) => {
        const x = centerX + point.x * scale;
        const y = centerY + point.y * scale;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = index === hoverPoint ? 'rgba(212, 175, 55, 0.9)' : 'rgba(212, 175, 55, 0.5)';
        ctx.fill();
      });
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawSpiral(ctx, canvas.width, canvas.height);
    });
    
    resizeObserver.observe(container);
    
    // Initial draw
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    drawSpiral(ctx, canvas.width, canvas.height);
    
    // Animation
    if (isAnimating) {
      let progress = 0;
      const animate = () => {
        if (progress < 1) {
          progress += 0.01;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Apply animation transformations
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(progress * Math.PI * 2);
          ctx.scale(progress, progress);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
          
          drawSpiral(ctx, canvas.width, canvas.height);
          ctx.restore();
          
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          drawSpiral(ctx, canvas.width, canvas.height);
        }
      };
      
      animate();
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [turns, isAnimating, hoverPoint]);
  
  const handleMouseInteraction = (e: React.MouseEvent) => {
    if (!interactive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Detect if mouse is over a point
    const spiralPoints = generateFibonacciSpiralPoints(turns, 50);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) * 0.45;
    
    const pointIndex = spiralPoints
      .filter((_, i) => i % 50 === 0)
      .findIndex((point, i) => {
        const pointX = centerX + point.x * scale;
        const pointY = centerY + point.y * scale;
        const distance = Math.sqrt(Math.pow(pointX - x, 2) + Math.pow(pointY - y, 2));
        return distance < 10;
      });
    
    setHoverPoint(pointIndex >= 0 ? pointIndex : null);
  };
  
  const triggerAnimation = () => {
    if (interactive && !isAnimating) {
      setIsAnimating(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg",
        className
      )}
      onMouseMove={handleMouseInteraction}
      onClick={triggerAnimation}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      
      {showNumbers && (
        <div className="absolute inset-x-0 bottom-0 p-6 flex justify-center space-x-3 glass-panel bg-dark-secondary/60">
          {sequence.slice(0, 10).map((num, i) => (
            <div
              key={i}
              className={cn(
                "fibonacci-number text-sm md:text-base flex items-center justify-center",
                highlightNumbers.includes(num) && "text-golden font-semibold scale-110",
                i >= 4 && i <= 6 && "text-white opacity-80"
              )}
            >
              {num}
            </div>
          ))}
        </div>
      )}
      
      {hoverPoint !== null && interactive && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 p-2 glass-panel rounded text-sm text-silver">
          Spiral Point: {hoverPoint + 1}
        </div>
      )}
      
      {interactive && (
        <div className="absolute top-4 right-4 text-xs text-silver/60 glass-panel px-3 py-1 rounded-full">
          Click to animate
        </div>
      )}
    </div>
  );
};

export default FibonacciVisualizer;
