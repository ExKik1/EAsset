import React from "react";
import { motion } from "motion/react";

interface TabNavigationProps {
  activeTab: "encrypt" | "decrypt";
  isLoading: boolean;
  onTabChange: (tab: "encrypt" | "decrypt") => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  isLoading,
  onTabChange,
}) => {
  return (
    <div className="flex space-x-1 bg-slate-300 p-1.5 w-full max-w-[280px] sm:w-64 mb-6 sm:mb-8 shrink-0 relative">
      {(["encrypt", "decrypt"] as const).map((tab) => (
        <button
          key={tab}
          disabled={isLoading}
          onClick={() => onTabChange(tab)}
          className={`flex-1 relative py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
            activeTab === tab
              ? "text-white z-10 font-bold"
              : "text-slate-500 hover:text-slate-700 cursor-pointer z-10"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-brand-gradient rounded-lg shadow-sm -z-0"
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 30,
              }}
            />
          )}
          <span className="relative z-10">
            {tab === "encrypt" ? "Encryption" : "Decryption"}
          </span>
        </button>
      ))}
    </div>
  );
};
