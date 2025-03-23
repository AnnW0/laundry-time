
import { mockHalls } from "@/lib/data";
import { Hall, Machine, SortOption } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export function useMachines() {
  const [halls, setHalls] = useState<Hall[]>(mockHalls);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [expandedHallId, setExpandedHallId] = useState<string>("a1");
  const { toast } = useToast();

  // Sort halls: starred first, then by availability of machines
  const sortedHalls = [...halls].sort((a, b) => {
    // First by star status
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;

    if (sortOption === "available-first") {
      // Then by availability if the sort option is 'available-first'
      const aAvailableCount = a.machines.filter(m => m.status === "available").length;
      const bAvailableCount = b.machines.filter(m => m.status === "available").length;
      if (aAvailableCount !== bAvailableCount) {
        return bAvailableCount - aAvailableCount;
      }
    }

    // Default sorting by hall name
    return a.name.localeCompare(b.name);
  });

  const toggleStar = (hallId: string) => {
    setHalls(prev => 
      prev.map(hall => 
        hall.id === hallId 
          ? { ...hall, isStarred: !hall.isStarred } 
          : hall
      )
    );

    const hall = halls.find(h => h.id === hallId);
    if (hall) {
      toast({
        title: hall.isStarred 
          ? `Removed ${hall.name} from favorites` 
          : `Added ${hall.name} to favorites`,
        duration: 2000,
      });
    }
  };

  const toggleSortOption = () => {
    setSortOption(prev => prev === "default" ? "available-first" : "default");
    toast({
      title: `Sorted by ${sortOption === "default" ? "available first" : "default order"}`,
      duration: 2000,
    });
  };

  const refreshMachines = () => {
    // Simulate a refresh by making a small change to the data
    setHalls(prev => {
      const newHalls = [...prev];
      
      // Randomly update some machine statuses for demo purposes
      const randomHallIndex = Math.floor(Math.random() * newHalls.length);
      const randomMachineIndex = Math.floor(Math.random() * newHalls[randomHallIndex].machines.length);
      
      const currentMachine = newHalls[randomHallIndex].machines[randomMachineIndex];
      
      // Update the machine status in a somewhat realistic way
      if (currentMachine.status === "running" && (currentMachine.timeRemaining || 0) <= 1) {
        currentMachine.status = "done";
        currentMachine.timeRemaining = 15;
      } else if (currentMachine.status === "done" && (currentMachine.timeRemaining || 0) <= 1) {
        currentMachine.status = "available";
        currentMachine.timeRemaining = undefined;
      } else if (currentMachine.status === "running" && currentMachine.timeRemaining) {
        currentMachine.timeRemaining -= 1;
      } else if (currentMachine.status === "done" && currentMachine.timeRemaining) {
        currentMachine.timeRemaining -= 1;
      }
      
      return newHalls;
    });

    toast({
      title: "Updated machine statuses",
      duration: 2000,
    });
  };

  const setExpandedHall = (hallId: string) => {
    setExpandedHallId(hallId);
  };

  // Get the main view hall (first in the list or the expanded one)
  const mainViewHall = halls.find(h => h.id === expandedHallId) || sortedHalls[0];

  // Automatically update machine statuses every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setHalls(prev => {
        return prev.map(hall => ({
          ...hall,
          machines: hall.machines.map(machine => {
            if (machine.timeRemaining && machine.timeRemaining > 0) {
              return {
                ...machine,
                timeRemaining: machine.timeRemaining - 1,
                // If a running machine reaches 0, change to done
                status: machine.status === "running" && machine.timeRemaining === 1 
                  ? "done" 
                  : machine.status === "done" && machine.timeRemaining === 1
                    ? "available"
                    : machine.status
              };
            }
            return machine;
          })
        }));
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return {
    halls: sortedHalls,
    mainViewHall,
    sortOption,
    toggleStar,
    toggleSortOption,
    refreshMachines,
    setExpandedHall,
  };
}
