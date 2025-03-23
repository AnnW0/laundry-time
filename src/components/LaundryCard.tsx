
import { Hall, Machine } from "@/types";
import { cn } from "@/lib/utils";
import { Star, Wind, Waves, Moon } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { useTime } from "@/hooks/useTime";

interface MachineStatusProps {
  machine: Machine;
}

function MachineStatus({ machine }: MachineStatusProps) {
  const getStatusColor = () => {
    switch (machine.status) {
      case "available":
        return "text-laundry-available";
      case "done":
        return "text-laundry-soon";
      case "running":
        return "text-laundry-running";
      case "offline":
        return "text-gray-400";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = () => {
    switch (machine.status) {
      case "available":
        return "Available";
      case "done":
        return machine.timeRemaining 
          ? `Available in ${machine.timeRemaining} min` 
          : "Available";
      case "running":
        return "Running";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex items-center justify-end">
      <span className={cn("status-text font-semibold text-lg", getStatusColor())}>
        {getStatusText()}
      </span>
    </div>
  );
}

function formatHallName(name: string) {
  // Extract letter and number (e.g., "Hall A1" -> { letter: "A", number: "1" })
  const match = name.match(/Hall\s+([A-Z])(\d+)/i);
  if (match) {
    return (
      <>
        <span className="text-black font-bold">{match[1]}</span>
        <span className="ml-3 bg-laundry-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
          {match[2]}
        </span>
      </>
    );
  }
  return name;
}

interface MainCardProps {
  hall: Hall;
  onToggleStar: (hallId: string) => void;
}

export function MainCard({ hall, onToggleStar }: MainCardProps) {
  const { isCurfew, isApproachingCurfew } = useTime();
  
  const machines = hall.machines.sort((a, b) => 
    a.type === "washer" ? -1 : 1
  );

  return (
    <div className="main-card w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-black mr-3">Hall {formatHallName(hall.name)}</h2>
          {(isApproachingCurfew || isCurfew) && (
            <Moon 
              className={cn(
                "moon-gradient",
                isCurfew ? "fill-current" : ""
              )} 
              size={24} 
            />
          )}
        </div>
        <button 
          onClick={() => onToggleStar(hall.id)}
          className="focus:outline-none transition-transform active:scale-90 duration-200"
        >
          <Star 
            size={24} 
            className={cn(
              "transition-colors duration-300",
              hall.isStarred 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            )} 
          />
        </button>
      </div>
      
      <div className="space-y-6">
        {machines.map(machine => {
          const bgColor = machine.status === "available" 
            ? "bg-[#F2FCE2]/80" 
            : machine.status === "done" 
              ? "bg-[#FEF7CD]/80"
              : machine.status === "running"
                ? "bg-[#FFDEE2]/80"
                : "bg-gray-100/80";
          
          return (
            <div key={machine.id} className={cn("rounded-[2rem] p-6", bgColor)}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div className="bg-white/80 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    {machine.type === "washer" ? (
                      <Waves size={22} className="text-laundry-blue" />
                    ) : (
                      <Wind size={22} className="text-laundry-blue" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-black">
                    {machine.type === "washer" ? "Washer" : "Dryer"}
                  </h3>
                </div>
                <MachineStatus machine={machine} />
              </div>
              
              {machine.status === "done" && machine.timeRemainingSeconds !== undefined && (
                <ProgressBar 
                  value={15 * 60 - (machine.timeRemainingSeconds || 0)}
                  max={15 * 60}
                  color="bg-laundry-soon"
                  className="mt-2"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface CompactCardProps {
  hall: Hall;
  onToggleStar: (hallId: string) => void;
  onSelect: () => void;
}

export function CompactCard({ hall, onToggleStar, onSelect }: CompactCardProps) {
  // Group machines by type
  const washers = hall.machines.filter(m => m.type === "washer");
  const dryers = hall.machines.filter(m => m.type === "dryer");

  return (
    <div className="machine-card w-full" onClick={onSelect}>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center">
          <h3 className="text-lg font-bold text-black mr-2">Hall {formatHallName(hall.name)}</h3>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(hall.id);
          }}
          className="focus:outline-none transition-transform active:scale-90 duration-200"
        >
          <Star 
            size={20} 
            className={cn(
              "transition-colors duration-300",
              hall.isStarred 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            )} 
          />
        </button>
      </div>
      
      <div className="flex flex-col space-y-4">
        {washers.map(machine => {
          const bgColor = machine.status === "available" 
            ? "bg-[#F2FCE2]/80" 
            : machine.status === "done" 
              ? "bg-[#FEF7CD]/80"
              : machine.status === "running"
                ? "bg-[#FFDEE2]/80"
                : "bg-gray-100/80";
          
          return (
            <div key={machine.id} className={cn("rounded-[1.5rem] px-5 py-3 flex justify-between items-center", bgColor)}>
              <div className="flex items-center">
                <div className="bg-white/80 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  <Waves size={18} className="text-laundry-blue" />
                </div>
                <span className="font-medium text-black">Washer</span>
              </div>
              
              {machine.status === "available" && (
                <span className="status-dot bg-laundry-available"></span>
              )}
              
              {machine.status === "done" && machine.timeRemaining && (
                <span className="text-sm text-laundry-soon font-medium">
                  {machine.timeRemaining}m
                </span>
              )}
              
              {machine.status === "running" && (
                <span className="status-dot bg-laundry-running"></span>
              )}
              
              {machine.status === "offline" && (
                <span className="status-dot bg-gray-400"></span>
              )}
            </div>
          );
        })}
        
        {dryers.map(machine => {
          const bgColor = machine.status === "available" 
            ? "bg-[#F2FCE2]/80" 
            : machine.status === "done" 
              ? "bg-[#FEF7CD]/80"
              : machine.status === "running"
                ? "bg-[#FFDEE2]/80"
                : "bg-gray-100/80";
          
          return (
            <div key={machine.id} className={cn("rounded-[1.5rem] px-5 py-3 flex justify-between items-center", bgColor)}>
              <div className="flex items-center">
                <div className="bg-white/80 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  <Wind size={18} className="text-laundry-blue" />
                </div>
                <span className="font-medium text-black">Dryer</span>
              </div>
              
              {machine.status === "available" && (
                <span className="status-dot bg-laundry-available"></span>
              )}
              
              {machine.status === "done" && machine.timeRemaining && (
                <span className="text-sm text-laundry-soon font-medium">
                  {machine.timeRemaining}m
                </span>
              )}
              
              {machine.status === "running" && (
                <span className="status-dot bg-laundry-running"></span>
              )}
              
              {machine.status === "offline" && (
                <span className="status-dot bg-gray-400"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
