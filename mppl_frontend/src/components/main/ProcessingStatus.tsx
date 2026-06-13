import React from "react";
import { motion } from "motion/react";

interface ProcessingStatusProps {
  currentStage: number;
  activeStages: string[];
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  currentStage,
  activeStages,
}) => {
  const progressPercent = Math.round(((currentStage + 1) / 5) * 100);

  return (
    <motion.div className="bg-slate-50 border border-slate-150 rounded-lg p-4.5 space-y-3.5 overflow-hidden shadow-inner">
      <div className="flex items-center justify-between font-mono text-[11px] font-semibold text-slate-600">
        <span className="flex items-center gap-1.5 text-[#0b2f9f] font-bold">
          <span className="w-2 h-2 bg-[#0b2f9f] rounded-full animate-ping" />
          PROCESSING CRYPTO TASK...
        </span>
        <span className="font-bold text-slate-700">{progressPercent}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0b2f9f] to-[#00809d] transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <ul className="text-[10px] font-mono space-y-1.5 text-slate-500">
        =
        {activeStages.map((stage, idx) => {
          const isDone = currentStage > idx;
          const isCurrent = currentStage === idx;
          return (
            <li
              key={idx}
              className={`flex items-center space-x-2 transition-colors duration-300 ${
                isDone
                  ? "text-emerald-600 font-medium"
                  : isCurrent
                    ? "text-[#0b2f9f] font-bold"
                    : "text-slate-400"
              }`}
            >
              <span>{isDone ? "✓" : isCurrent ? "→" : "○"}</span>
              <span>{stage}</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};
