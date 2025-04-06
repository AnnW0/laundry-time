"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ArrowUpDown, WashingMachine, Wind } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Initial demo data with washer and dryer times in seconds
const initialLaundryHalls = [
  { id: "A", number: 1, washer: "available", washerTime: 600, dryer: "occupied", dryerTime: 840, favorite: false },
  { id: "B", number: 2, washer: "running", dryer: "available", dryerTime: 300, favorite: false },
  { id: "C", number: 3, washer: "available", washerTime: 420, dryer: "available", dryerTime: 720, favorite: false },
  { id: "D", number: 4, washer: "available", dryer: "running", dryerTime: 900, favorite: false },
  { id: "E", number: 5, washer: "occupied", washerTime: 300, dryer: "occupied", dryerTime: 420, favorite: false },
];

const statusColors = {
  available: "bg-green-200 text-green-900",
  occupied: "bg-orange-200 text-orange-900",
  running: "bg-red-200 text-red-900",
};

const statusPriority = {
  available: 0,
  occupied: 1,
  running: 2,
  offline: 3, // Assuming "offline" is a possible state
};

export default function LaundryApp() {
  const [halls, setHalls] = useState(initialLaundryHalls);
  const [sortBy, setSortBy] = useState<"hall" | "washer" | "dryer">("hall");
  const [testMode, setTestMode] = useState(false); // Toggle for test mode

  // Load halls data from localStorage if it exists
  useEffect(() => {
    const storedHalls = localStorage.getItem("laundryHalls");
    if (storedHalls) {
      setHalls(JSON.parse(storedHalls));
    } else {
      localStorage.setItem("laundryHalls", JSON.stringify(initialLaundryHalls));
    }
  }, []);

  // Save halls data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("laundryHalls", JSON.stringify(halls));
  }, [halls]);

  // Simulate real-time updates (time progression every second)
  useEffect(() => {
    if (!testMode) {
      const interval = setInterval(() => {
        setHalls((prevHalls) => {
          const updatedHalls = prevHalls.map((hall) => {
            if (hall.washer === "occupied" && hall.washerTime !== undefined && hall.washerTime > 0) {
              hall.washerTime = Math.max(0, hall.washerTime - 1); // Decrement time
              if (hall.washerTime === 0) {
                hall.washer = "available"; // Transition to available when time is up
              }
            }
            if (hall.dryer === "occupied" && hall.dryerTime !== undefined && hall.dryerTime > 0) {
              hall.dryerTime = Math.max(0, hall.dryerTime - 1); // Decrement time
              if (hall.dryerTime === 0) {
                hall.dryer = "available"; // Transition to available when time is up
              }
            }
            return hall;
          });

          // Reapply sorting based on the current `sortBy` value
          const sortedHalls = [...updatedHalls];
          sortedHalls.sort((a, b) => {
            if (a.favorite !== b.favorite) {
              return b.favorite ? 1 : -1; // Favorites always come first
            }

            if (sortBy === "hall") {
              return a.number - b.number;
            } else if (sortBy === "washer") {
              const statusDiff =
                statusPriority[a.washer as keyof typeof statusPriority] -
                statusPriority[b.washer as keyof typeof statusPriority];
              if (statusDiff !== 0) return statusDiff;
              return (a.washerTime ?? 0) - (b.washerTime ?? 0);
            } else if (sortBy === "dryer") {
              const statusDiff =
                statusPriority[a.dryer as keyof typeof statusPriority] -
                statusPriority[b.dryer as keyof typeof statusPriority];
              if (statusDiff !== 0) return statusDiff;
              return (a.dryerTime ?? 0) - (b.dryerTime ?? 0);
            }

            return 0;
          });

          return sortedHalls;
        });
      }, 1000); // Update every second

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [testMode, sortBy]); // Add `sortBy` as a dependency

  const sortHalls = (criteria: "hall" | "washer" | "dryer") => {
    setSortBy(criteria);
    setHalls((prevHalls) => {
      const sortedHalls = [...prevHalls];

      // Define sorting priority for statuses
      const statusPriority = {
        available: 0,
        occupied: 1,
        running: 2,
        offline: 3, // Assuming "offline" is a possible state
      };

      // Sort based on the selected criteria
      sortedHalls.sort((a, b) => {
        if (a.favorite !== b.favorite) {
          return b.favorite ? 1 : -1; // Favorites always come first
        }

        if (criteria === "hall") {
          return a.number - b.number;
        } else if (criteria === "washer") {
          const statusDiff =
            statusPriority[a.washer as keyof typeof statusPriority] -
            statusPriority[b.washer as keyof typeof statusPriority];
          if (statusDiff !== 0) return statusDiff;
          return (a.washerTime ?? 0) - (b.washerTime ?? 0); // Sort by time ascending
        } else if (criteria === "dryer") {
          const statusDiff =
            statusPriority[a.dryer as keyof typeof statusPriority] -
            statusPriority[b.dryer as keyof typeof statusPriority];
          if (statusDiff !== 0) return statusDiff;
          return (a.dryerTime ?? 0) - (b.dryerTime ?? 0); // Sort by time ascending
        }

        return 0;
      });

      return sortedHalls;
    });
  };

  const renderProgressBar = (timeLeft: number) => {
    if (timeLeft === undefined) return null;

    const maxTime = 900; // Assuming 900 seconds (15 minutes) as the max time for progress bar
    const elapsedTime = maxTime - timeLeft;
    const percentage = Math.max(0, Math.min((elapsedTime / maxTime) * 100, 100));

    return (
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute h-2 rounded-full bg-orange-300"
          style={{ width: `${percentage}%` }}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1 }}
        ></motion.div>
      </div>
    );
  };

  const cycleState = (currentState: string) => {
    if (currentState === "available") return "occupied";
    if (currentState === "occupied") return "running";
    return "available";
  };

  function toggleFavorite(id: string): void {
    setHalls((prevHalls) =>
      prevHalls.map((hall) =>
        hall.id === id ? { ...hall, favorite: !hall.favorite } : hall
      )
    );
  }
  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => sortHalls(sortBy === "hall" ? "washer" : sortBy === "washer" ? "dryer" : "hall")}>
          <ArrowUpDown className="w-4 h-4 mr-2" /> Sort: {sortBy}
        </Button>
        <Button onClick={() => setTestMode(!testMode)}>
          {testMode ? "Exit Test Mode" : "Enter Test Mode"}
        </Button>
      </div>
      <AnimatePresence>
        {halls.map((hall, hallIndex) => (
          <motion.div
            key={hall.id + hall.number}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 mb-3 rounded-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Hall {hall.id}: {hall.number}</h2>
                <Star
                  className={`cursor-pointer w-5 h-5 ${hall.favorite ? "fill-yellow-500" : "stroke-gray-500"}`}
                  onClick={() => toggleFavorite(hall.id)}
                />
              </div>
              <div className="mt-2">
                {(["washer", "dryer"] as ("washer" | "dryer")[]).map((machine) => (
                  <motion.div
                    key={machine}
                    className={`p-3 rounded-xl mt-2 flex flex-col ${
                      statusColors[hall[machine] as keyof typeof statusColors]
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => {
                      if (testMode && !(e.target as HTMLElement).closest("input")) {
                        setHalls((prevHalls) => {
                          const updatedHalls = [...prevHalls];
                          updatedHalls[hallIndex][machine] = cycleState(hall[machine]);
                          return updatedHalls;
                        });
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {machine === "washer" ? (
                          <WashingMachine className="mr-2 w-5 h-5" />
                        ) : (
                          <Wind className="mr-2 w-5 h-5" />
                        )}
                        <span className="capitalize font-medium mr-2">{machine}</span>
                      </div>
                      {hall[machine] === "occupied" && hall[`${machine}Time` as "washerTime" | "dryerTime"] !== undefined && (
                        <span className="text-sm">
                          Available in {Math.ceil((hall[`${machine}Time` as "washerTime" | "dryerTime"] ?? 0) / 60)}{" "}
                          mins
                        </span>
                      )}
                    </div>
                    {hall[machine] === "occupied" && hall[`${machine}Time` as "washerTime" | "dryerTime"] !== undefined && (
                      <div className="mt-2">{renderProgressBar(hall[`${machine}Time` as "washerTime" | "dryerTime"] ?? 0)}</div>
                    )}
                    {testMode && hall[machine] === "occupied" && (
                      <div className="mt-2 flex items-center space-x-2">
                        <label className="text-sm font-medium">Time (secs):</label>
                        <input
                          type="number"
                          className="w-16 p-1 border rounded"
                          value={hall[`${machine}Time` as "washerTime" | "dryerTime"] ?? 0}
                          onChange={(e) => {
                            const newTime = Math.max(0, parseInt(e.target.value) || 0);
                            setHalls((prevHalls) => {
                              const updatedHalls = [...prevHalls];
                              updatedHalls[hallIndex][`${machine}Time` as "washerTime" | "dryerTime"] = newTime;
                              return updatedHalls;
                            });
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}