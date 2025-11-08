"use client";

import React from "react";
import { motion } from "framer-motion";

interface MultiSelectProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedOptions,
  onChange,
}) => {
  const handleOptionClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      onChange([]);
    } else {
      onChange([option]);
    }
  };

  const handleAllClick = () => {
    onChange([]);
  };

  const isAllSelected = selectedOptions.length === 0;

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3 justify-center items-center">
        <motion.button
          onClick={handleAllClick}
          className={`relative px-6 py-2.5 rounded-full text-sm font-medium
                     transition-all duration-300 border ${
                       isAllSelected
                         ? "text-white bg-zinc-800 border-blue-500/50 shadow-lg shadow-blue-900/20"
                         : "text-zinc-400 bg-transparent border-zinc-700 hover:text-white hover:border-zinc-600"
                     }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All
        </motion.button>

        {options.map((option) => {
          const isSelected = selectedOptions.includes(option);
          return (
            <motion.button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-medium
                         transition-all duration-300 border ${
                           isSelected
                             ? "text-white bg-zinc-800 border-blue-500/50 shadow-lg shadow-blue-900/20"
                             : "text-zinc-400 bg-transparent border-zinc-700 hover:text-white hover:border-zinc-600"
                         }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSelect;
