import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisplayProps {
  expression: string;
  result: string;
}

export const Display: React.FC<DisplayProps> = ({ expression, result }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to end of expression when it updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [expression]);

  return (
    <div className="w-full bg-zinc-900/50 p-6 rounded-3xl mb-4 border border-zinc-800 flex flex-col items-end justify-end h-40 relative overflow-hidden">
      {/* Background glow for aesthetic */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

      {/* Expression (Input) */}
      <div 
        ref={scrollRef}
        className="w-full overflow-x-auto whitespace-nowrap text-right scrollbar-hide"
      >
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          className="text-zinc-400 text-lg sm:text-xl font-mono tracking-wider"
        >
          {expression || "\u00A0"}
        </motion.span>
      </div>

      {/* Result (Main) */}
      <div className="w-full text-right overflow-hidden mt-1">
        <AnimatePresence mode="popLayout">
          <motion.h1
            key={result || "empty"}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.05, position: 'absolute', right: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight break-all"
          >
            {result || "0"}
          </motion.h1>
        </AnimatePresence>
      </div>
    </div>
  );
};