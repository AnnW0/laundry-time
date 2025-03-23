
import { Hall, Machine } from "@/types";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { ProgressBar, AnimatedProgressBar } from "./ProgressBar";

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
        return machine.timeRemaining 
          ? `${machine.timeRemaining}m remaining` 
          : "Running";
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
        <h2 className="text-2xl font-yeseva text-gray-800">{hall.name}</h2>
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
              <h3 className="text-xl font-yeseva text-gray-700">{machine.name}</h3>
              <MachineStatus machine={machine} />
            </div>
            
            {machine.status === "done" && machine.timeRemaining && (
              <AnimatedProgressBar 
                durationMinutes={machine.timeRemaining}
                color="bg-laundry-soon"
              />
            )}
            
            {machine.status === "running" && machine.timeRemaining && (
              <ProgressBar 
                value={35 - (machine.timeRemaining || 0)}
                max={35}
                color="bg-laundry-running"
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
  const machines = hall.machines.sort((a, b) => 
    a.type === "washer" ? -1 : 1
  );

  return (
    <div className="machine-card w-full" onClick={onSelect}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-yeseva text-gray-800">{hall.name}</h3>
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
      
      <div className="grid grid-cols-2 gap-2">
        {machines.map(machine => (
          <div key={machine.id} className="flex justify-between items-center">
            <span className="text-lg font-yeseva text-gray-700">{machine.name}</span>
            
            {machine.status === "available" && (
              <span className="status-dot bg-laundry-available"></span>
            )}
            
            {machine.status === "running" && machine.timeRemaining && (
              <span className="text-sm text-laundry-running font-medium">
                {machine.timeRemaining}m
              </span>
            )}
            
            {machine.status === "done" && machine.timeRemaining && (
              <span className="text-sm text-laundry-soon font-medium">
                {machine.timeRemaining}m
              </span>
            )}
            
            {machine.status === "running" && !machine.timeRemaining && (
              <span className="status-dot bg-laundry-running"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
