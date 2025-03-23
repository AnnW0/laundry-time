import { mockHalls } from "@/lib/data";
import { Hall, Machine, SortOption } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const DEFAULT_CURRENT_THRESHOLD = 0.5; // Amps

export function useMachines() {
  const [halls, setHalls] = useState<Hall[]>(mockHalls);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [expandedHallId, setExpandedHallId] = useState<string>("a1");
  const [currentThreshold, setCurrentThreshold] = useState<number>(DEFAULT_CURRENT_THRESHOLD);
  const [notificationPermission, setNotificationPermission] = useState<boolean>(false);
  const { toast } = useToast();

  // Sort halls based on the current sortOption
  const sortedHalls = [...halls].sort((a, b) => {
    // First by star status
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;

    if (sortOption === "available-first") {
      // Then by availability
      const aAvailableCount = a.machines.filter(m => m.status === "available").length;
      const bAvailableCount = b.machines.filter(m => m.status === "available").length;
      if (aAvailableCount !== bAvailableCount) {
        return bAvailableCount - aAvailableCount;
      }
    } else if (sortOption === "washer-first") {
      // By washer availability
      const aAvailableWashers = a.machines.filter(m => m.status === "available" && m.type === "washer").length;
      const bAvailableWashers = b.machines.filter(m => m.status === "available" && m.type === "washer").length;
      if (aAvailableWashers !== bAvailableWashers) {
        return bAvailableWashers - aAvailableWashers;
      }
    } else if (sortOption === "dryer-first") {
      // By dryer availability
      const aAvailableDryers = a.machines.filter(m => m.status === "available" && m.type === "dryer").length;
      const bAvailableDryers = b.machines.filter(m => m.status === "available" && m.type === "dryer").length;
      if (aAvailableDryers !== bAvailableDryers) {
        return bAvailableDryers - aAvailableDryers;
      }
    }

    // Default sorting by hall name
    return a.name.localeCompare(b.name);
  });

  // Toggle star status for a hall
  const toggleStar = async (hallId: string) => {
    const hall = halls.find(h => h.id === hallId);
    const isCurrentlyStarred = hall?.isStarred || false;
    
    setHalls(prev => 
      prev.map(hall => 
        hall.id === hallId 
          ? { ...hall, isStarred: !hall.isStarred } 
          : hall
      )
    );

    // If we're starring a hall, request notification permission
    if (!isCurrentlyStarred && !notificationPermission) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission === "granted");
        
        if (permission === "granted") {
          toast({
            title: "Notifications enabled",
            description: "You'll be notified when machines become available",
            duration: 3000,
          });
        } else {
          toast({
            title: "Notifications not enabled",
            description: "You won't receive alerts when machines become available",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }

    if (hall) {
      toast({
        title: hall.isStarred 
          ? `Removed ${hall.name} from favorites` 
          : `Added ${hall.name} to favorites`,
        duration: 2000,
      });
    }
  };

  // Cycle through sort options
  const toggleSortOption = () => {
    setSortOption(prev => {
      const options: SortOption[] = ["default", "available-first", "washer-first", "dryer-first"];
      const currentIndex = options.indexOf(prev);
      const nextIndex = (currentIndex + 1) % options.length;
      
      const nextOption = options[nextIndex];
      
      toast({
        title: `Sorted by ${
          nextOption === "default" ? "name" : 
          nextOption === "available-first" ? "availability" : 
          nextOption === "washer-first" ? "washer availability" : 
          "dryer availability"
        }`,
        duration: 2000,
      });
      
      return nextOption;
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
      if (currentMachine.status === "running") {
        currentMachine.status = "done";
        currentMachine.timeRemaining = 15;
        currentMachine.timeRemainingSeconds = 15 * 60;
      } else if (currentMachine.status === "done" && currentMachine.timeRemainingSeconds && currentMachine.timeRemainingSeconds <= 0) {
        currentMachine.status = "available";
        currentMachine.timeRemaining = undefined;
        currentMachine.timeRemainingSeconds = undefined;
      } else if (currentMachine.status === "available") {
        currentMachine.status = "running";
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

  // Helper function to send notification
  const sendNotification = (hall: Hall, machine: Machine, type: "available" | "occupied") => {
    if (!notificationPermission) return;
    
    try {
      if (type === "available") {
        new Notification(`${machine.type === "washer" ? "Washer" : "Dryer"} Available`, {
          body: `A ${machine.type} in ${hall.name} is now available!`,
          icon: "/favicon.ico",
        });
      } else if (type === "occupied" && machine.timeRemaining) {
        new Notification(`${machine.type === "washer" ? "Washer" : "Dryer"} Done`, {
          body: `A ${machine.type} in ${hall.name} will be available in ${machine.timeRemaining} minutes.`,
          icon: "/favicon.ico",
        });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Set current threshold
  const updateCurrentThreshold = (threshold: number) => {
    setCurrentThreshold(threshold);
  };

  // Automatically update machine statuses every second for smoother progress
  useEffect(() => {
    const interval = setInterval(() => {
      setHalls(prev => {
        const updatedHalls = prev.map(hall => ({
          ...hall,
          machines: hall.machines.map(machine => {
            // Only update machines in "done" state with time remaining
            if (machine.status === "done" && machine.timeRemainingSeconds !== undefined) {
              const updatedSecondsRemaining = Math.max(0, machine.timeRemainingSeconds - 1);
              const updatedMinutesRemaining = Math.ceil(updatedSecondsRemaining / 60);
              
              // If time is up, change to available
              if (updatedSecondsRemaining <= 0) {
                const newMachine = {
                  ...machine,
                  status: "available" as const,
                  timeRemaining: undefined,
                  timeRemainingSeconds: undefined
                };
                
                // Send notification if the hall is starred
                if (hall.isStarred) {
                  sendNotification(hall, newMachine, "available");
                }
                
                return newMachine;
              }
              
              // Otherwise just update the time
              return {
                ...machine,
                timeRemainingSeconds: updatedSecondsRemaining,
                timeRemaining: updatedMinutesRemaining
              };
            }
            return machine;
          })
        }));
        
        return updatedHalls;
      });
    }, 1000); // Update every second for smooth progress

    return () => clearInterval(interval);
  }, [notificationPermission]);

  // Get the main view hall (first in the list or the expanded one)
  const mainViewHall = halls.find(h => h.id === expandedHallId) || sortedHalls[0];

  return {
    halls: sortedHalls,
    mainViewHall,
    sortOption,
    currentThreshold,
    toggleStar,
    toggleSortOption,
    refreshMachines,
    setExpandedHall,
    updateCurrentThreshold,
  };
}
