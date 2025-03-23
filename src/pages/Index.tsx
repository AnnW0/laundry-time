
import { Header } from "@/components/Header";
import { LaundryList } from "@/components/LaundryList";
import { useMachines } from "@/hooks/useMachines";

const Index = () => {
  const { 
    halls, 
    mainViewHall,
    sortOption,
    toggleStar, 
    toggleSortOption, 
    refreshMachines,
    setExpandedHall
  } = useMachines();

  return (
    <div className="min-h-screen flex flex-col overflow-y-auto">
      <Header />
      
      <LaundryList
        halls={halls}
        mainViewHall={mainViewHall}
        sortOption={sortOption}
        onToggleStar={toggleStar}
        onToggleSort={toggleSortOption}
        onRefresh={refreshMachines}
        onSelectHall={setExpandedHall}
      />
    </div>
  );
};

export default Index;
