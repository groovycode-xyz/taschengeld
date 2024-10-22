import React, { useState, useEffect } from 'react';

interface TimeSinceProps {
  date: string;
}

export function TimeSince({ date }: TimeSinceProps) {
  const [timeSince, setTimeSince] = useState('');

  useEffect(() => {
    const updateTimeSince = () => {
      const now = new Date();
      const completedDate = new Date(date);
      const diffInSeconds = Math.floor((now.getTime() - completedDate.getTime()) / 1000);

      if (diffInSeconds < 60) {
        setTimeSince(`${diffInSeconds} sec ago`);
      } else if (diffInSeconds < 3600) {
        setTimeSince(`${Math.floor(diffInSeconds / 60)} min ago`);
      } else if (diffInSeconds < 86400) {
        setTimeSince(`${Math.floor(diffInSeconds / 3600)} hr ago`);
      } else {
        setTimeSince(`${Math.floor(diffInSeconds / 86400)} days ago`);
      }
    };

    updateTimeSince();
    const intervalId = setInterval(updateTimeSince, 1000);

    return () => clearInterval(intervalId);
  }, [date]);

  return <span>{timeSince}</span>;
}
