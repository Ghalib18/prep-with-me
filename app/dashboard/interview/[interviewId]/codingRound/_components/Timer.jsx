"use client";

import { useState, useEffect } from "react";
import { Timer as TimerIcon, AlertCircle } from "lucide-react";

const Timer = ({ initialMinutes = 20, initialSeconds = 0, onTimeUp }) => {
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
        if (onTimeUp) {
          onTimeUp(true);
        }
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [minutes, seconds, onTimeUp]);

  const isLowTime = minutes < 5;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors ${
        isLowTime
          ? "bg-rose-50 border-rose-200 text-rose-700 animate-pulse"
          : "bg-secondary border-border text-foreground"
      }`}
    >
      <TimerIcon className={`h-3.5 w-3.5 ${isLowTime ? "text-rose-600" : "text-indigo-600"}`} />
      <span>Time Remaining:</span>
      <span className="font-mono font-bold text-sm tracking-tight">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
};

export default Timer;