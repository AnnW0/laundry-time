
import { useEffect, useState } from "react";

export function useTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCurfew, setIsCurfew] = useState(false);
  const [isApproachingCurfew, setIsApproachingCurfew] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const hours = now.getHours();
      
      // Check if it's curfew (10 PM - 7 AM)
      setIsCurfew(hours >= 22 || hours < 7);
      
      // Check if it's approaching curfew (after 6 PM until 10 PM)
      setIsApproachingCurfew(hours >= 18 && hours < 22);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeDisplay = () => {
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return {
    currentTime,
    isCurfew,
    isApproachingCurfew,
    timeDisplay: formatTimeDisplay(),
  };
}
