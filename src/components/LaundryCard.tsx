
import { Hall, Machine } from "@/types";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
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
          : "Done & Occupied";
      case "running":
        return "Running";
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
        <span className="hall-letter">{match[1]}</span>
        <span className="hall-number">{match[2]}</span>
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
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-yeseva text-gray-800">Hall {formatHallName(hall.name)}</h2>
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
        {machines.map(machine => (
          <div key={machine.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-yeseva text-gray-700">{machine.type === "washer" ? "Washer" : "Dryer"}</h3>
              <MachineStatus machine={machine} />
            </div>
            
            {machine.status === "done" && machine.timeRemaining && (
              <ProgressBar 
                value={15 - (machine.timeRemaining || 0)}
                max={15}
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
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-yeseva text-gray-800">Hall {formatHallName(hall.name)}</h3>
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
      
      <div className="flex flex-col space-y-1">
        {/* Washers */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-yeseva text-gray-700">W</span>
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
              </div>
            ))}
          </div>
        </div>
        
        {/* Dryers */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-yeseva text-gray-700">D</span>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
