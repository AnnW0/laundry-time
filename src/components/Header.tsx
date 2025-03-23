
import { useTime } from "@/hooks/useTime";
import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const { timeDisplay, isCurfew, isApproachingCurfew } = useTime();

  return (
    <div className="relative flex flex-col items-center justify-center pt-10 pb-4">
      <div className={cn(
        "absolute top-10 left-10 transition-all duration-500",
        isCurfew ? "moon-gradient text-white" : "text-primary opacity-70"
      )}>
        <Moon 
          className={cn(
            "transition-all duration-500",
            isCurfew || isApproachingCurfew ? "opacity-100" : "opacity-60",
            isApproachingCurfew && !isCurfew && "animate-pulse-gentle"
          )}
          size={28} 
          fill={isCurfew ? "currentColor" : "none"} 
        />
      </div>
      
      <h1 className="text-6xl font-yeseva text-white drop-shadow-sm tracking-wider">
        {timeDisplay}
      </h1>
      
      {isCurfew && (
        <div className="mt-2 text-sm text-white/80 animate-fade-in">
          Quiet hours in effect
        </div>
      )}
      
      {isApproachingCurfew && !isCurfew && (
        <div className="mt-2 text-sm text-white/80 animate-fade-in">
          Quiet hours starting soon
        </div>
      )}
    </div>
  );
}
