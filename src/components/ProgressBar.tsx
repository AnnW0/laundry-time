
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  const [percent, setPercent] = useState(Math.min(Math.max((value / max) * 100, 0), 100));
  
  // Update the percentage smoothly
  useEffect(() => {
    const targetPercent = Math.min(Math.max((value / max) * 100, 0), 100);
    setPercent(targetPercent);
  }, [value, max]);
  
  return (
    <div className={cn("w-full h-3 bg-gray-100/30 rounded-full overflow-hidden transition-all", className)}>
      <div 
        className={cn("h-full rounded-full transition-all duration-300", color)}
        style={{ 
          width: `${percent}%`,
        }}
      />
    </div>
  );
}
