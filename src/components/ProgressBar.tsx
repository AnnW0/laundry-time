
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  color?: string;
}

export function ProgressBar({ 
  value, 
  max, 
  className,
  color = "bg-laundry-soon"
}: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={cn("w-full h-2 bg-gray-100 rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full rounded-full transition-all duration-1000", color)}
        style={{ 
          width: `${percent}%`,
        }}
      />
    </div>
  );
}

interface AnimatedProgressBarProps {
  durationMinutes: number;
  className?: string;
  color?: string;
}

export function AnimatedProgressBar({ 
  durationMinutes, 
  className,
  color = "bg-laundry-soon"
}: AnimatedProgressBarProps) {
  const durationSeconds = durationMinutes * 60;
  
  return (
    <div className={cn("w-full h-2 bg-gray-100 rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full rounded-full", color)}
        style={{ 
          animation: `progress ${durationSeconds}s linear`,
          width: '100%',
        }}
      />
    </div>
  );
}
