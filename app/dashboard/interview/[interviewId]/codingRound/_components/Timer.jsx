"use client";

import { useState, useEffect } from "react";

const Timer = ({ initialMinutes, initialSeconds, onTimeUp }) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        if (minutes === 0) {
          clearInterval(timerInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }

      if (minutes === 0 && seconds === 0) {
        onTimeUp(true);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [minutes, seconds]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl font-bold flex items-center flex-col gap-1">
        <span className="text-sm text-gray-500">Time Left: </span>
        <p>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>
      </div>
    </div>
  );
};

export default Timer;