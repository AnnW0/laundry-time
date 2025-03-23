
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
      case "available-first": return "All";
      case "washer-first": return "Washers";
      case "dryer-first": return "Dryers";
      default: return "Name";
    }
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      {/* Controls */}
      <div className="flex justify-between mb-4">
        <button
          onClick={onToggleSort}
          className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm py-2 px-4 rounded-full shadow-sm active:scale-95 transition-all duration-200"
        >
          <AlignLeft size={20} />
          <span>Sort: {getSortText()}</span>
        </button>
        
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm py-2 px-4 rounded-full shadow-sm active:scale-95 transition-all duration-200"
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
      <div className="grid grid-cols-2 gap-4 mt-4">
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
