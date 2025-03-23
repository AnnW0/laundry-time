
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
    <div className={cn("w-full h-2 bg-gray-100/50 rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full rounded-full transition-all duration-1000", color)}
        style={{ 
          width: `${percent}%`,
        }}
      />
    </div>
  );
}
