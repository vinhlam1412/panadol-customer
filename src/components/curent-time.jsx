import React, { useEffect, useState } from 'react';

const CurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date()); // Update time every minute
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(intervalId);
  }, []);

  // Format the time as hh:mm:ss AM/PM
  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <span>{formattedTime}</span>
  );
};

export default CurrentTime;