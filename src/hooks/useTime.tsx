
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
      const minutes = now.getMinutes();
      
      // Check if it's curfew (10 PM - 7 AM)
      setIsCurfew(hours >= 22 || hours < 7);
      
      // Check if it's approaching curfew (within 1 hour)
      setIsApproachingCurfew(hours === 21 && minutes >= 0);
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
