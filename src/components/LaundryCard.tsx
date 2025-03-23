
import { Hall, Machine } from "@/types";
import { cn } from "@/lib/utils";
import { Star, Wind, Waves } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

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

  const getStatusDot = () => {
    switch (machine.status) {
      case "available":
        return <span className="status-dot bg-laundry-available"></span>;
      case "done":
        return <span className="status-dot bg-laundry-soon"></span>;
      case "running":
        return <span className="status-dot bg-laundry-running"></span>;
      case "offline":
        return <span className="status-dot bg-gray-400"></span>;
      default:
        return <span className="status-dot bg-gray-300"></span>;
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
      <span className={cn("status-text", getStatusColor())}>
        {getStatusText()}
      </span>
      {getStatusDot()}
    </div>
  );
}

function formatHallName(name: string) {
  // Extract letter and number (e.g., "Hall A1" -> { letter: "A", number: "1" })
  const match = name.match(/Hall\s+([A-Z])(\d+)/i);
  if (match) {
    return (
      <>
        <span className="text-black">{match[1]}-</span>
        <span className="text-lilac">{match[2]}</span>
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
  const machines = hall.machines.sort((a, b) => 
    a.type === "washer" ? -1 : 1
  );

  return (
    <div className="main-card w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Hall {formatHallName(hall.name)}</h2>
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
      
      <div className="space-y-8">
        {machines.map(machine => (
          <div key={machine.id} className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {machine.type === "washer" ? (
                  <Waves size={20} className="mr-2 text-laundry-blue" />
                ) : (
                  <Wind size={20} className="mr-2 text-laundry-blue" />
                )}
                <h3 className="text-xl font-semibold text-black">{machine.type === "washer" ? "Washer" : "Dryer"}</h3>
              </div>
              <MachineStatus machine={machine} />
            </div>
            
            {machine.status === "done" && machine.timeRemaining && machine.timeRemainingSeconds && (
              <ProgressBar 
                value={15 * 60 - (machine.timeRemainingSeconds || 0)}
                max={15 * 60}
                color="bg-laundry-soon"
              />
            )}
          </div>
        ))}
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black">Hall {formatHallName(hall.name)}</h3>
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
        {/* Washers */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Waves size={16} className="mr-2 text-laundry-blue" />
            <span className="text-lg font-medium text-black">W</span>
          </div>
          <div className="flex items-center">
            {washers.map(machine => (
              <div key={machine.id} className="ml-2">
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
            ))}
          </div>
        </div>
        
        {/* Dryers */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Wind size={16} className="mr-2 text-laundry-blue" />
            <span className="text-lg font-medium text-black">D</span>
          </div>
          <div className="flex items-center">
            {dryers.map(machine => (
              <div key={machine.id} className="ml-2">
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
