
import { useTime } from "@/hooks/useTime";
import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const { timeDisplay, isCurfew, isApproachingCurfew } = useTime();

  return (
    <div className="relative flex flex-col items-center justify-center pt-10 pb-6">
      <div className={cn(
        "absolute top-10 left-10 transition-all duration-500",
        "moon-gradient rounded-full p-1.5"
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
      
      <h1 className="text-7xl font-bold text-black/90 tracking-wider no-shadows">
        {timeDisplay}
      </h1>
      
      {isCurfew && (
        <div className="mt-2 text-sm text-black/80 animate-fade-in">
          Quiet hours in effect
        </div>
      )}
      
      {isApproachingCurfew && !isCurfew && (
        <div className="mt-2 text-sm text-black/80 animate-fade-in">
          Quiet hours starting soon
        </div>
      )}
    </div>
  );
}
