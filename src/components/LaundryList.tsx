
import { Hall } from "@/types";
import { MainCard, CompactCard } from "./LaundryCard";
import { AlignLeft, RefreshCw } from "lucide-react";

interface LaundryListProps {
  halls: Hall[];
  mainViewHall: Hall;
  sortOption: string;
  onToggleStar: (hallId: string) => void;
  onToggleSort: () => void;
  onRefresh: () => void;
  onSelectHall: (hallId: string) => void;
}

export function LaundryList({
  halls,
  mainViewHall,
  sortOption,
  onToggleStar,
  onToggleSort,
  onRefresh,
  onSelectHall,
}: LaundryListProps) {
  // Get all halls except the main view hall
  const compactHalls = halls.filter(hall => hall.id !== mainViewHall.id);

  // Get sort option display text
  const getSortText = () => {
    switch(sortOption) {
      case "available-first": return "Name";
      case "washer-first": return "Washers";
      case "dryer-first": return "Dryers";
      default: return "Name";
    }
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      {/* Controls */}
      <div className="flex justify-between mb-5">
        <button
          onClick={onToggleSort}
          className="flex items-center space-x-2 bg-white/80 backdrop-blur-lg py-3 px-5 rounded-[1.25rem] active:scale-95 transition-all duration-200 font-medium"
        >
          <AlignLeft size={20} />
          <span>Sort: {getSortText()}</span>
        </button>
        
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 bg-white/80 backdrop-blur-lg py-3 px-5 rounded-[1.25rem] active:scale-95 transition-all duration-200 font-medium"
        >
          <RefreshCw size={20} />
          <span>Update</span>
        </button>
      </div>

      {/* Main Hall Card */}
      <MainCard 
        hall={mainViewHall} 
        onToggleStar={onToggleStar} 
      />

      {/* Secondary Hall Cards */}
      <div className="grid grid-cols-2 gap-4 mt-5">
        {compactHalls.map(hall => (
          <CompactCard
            key={hall.id}
            hall={hall}
            onToggleStar={onToggleStar}
            onSelect={() => onSelectHall(hall.id)}
          />
        ))}
      </div>
    </div>
  );
}
