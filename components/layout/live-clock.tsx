'use client';

import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/utils';
import { SYSTEM_TIME } from '@/lib/constants';

export function LiveClock() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date(SYSTEM_TIME));

  useEffect(() => {
    // Calculate the initial offset from SYSTEM_TIME
    const systemTime = new Date(SYSTEM_TIME);
    const realTime = new Date();
    const initialOffset = systemTime.getTime() - realTime.getTime();

    const updateClock = () => {
      const now = new Date();
      const adjustedTime = new Date(now.getTime() + initialOffset);
      setCurrentTime(adjustedTime);
    };

    // Update immediately
    updateClock();

    // Set up interval to update every second
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center text-sm">
      <div className="text-muted-foreground">Sistema</div>
      <div className="font-mono text-green-400">{formatTime(currentTime)}</div>
    </div>
  );
}