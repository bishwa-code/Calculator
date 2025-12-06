import React from 'react';
import { motion } from 'framer-motion';
import { ButtonVariant } from '../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CalculatorButtonProps {
  label: React.ReactNode;
  value: string;
  onClick: (val: string) => void;
  variant?: ButtonVariant;
  className?: string;
  doubleWidth?: boolean;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  value,
  onClick,
  variant = ButtonVariant.DEFAULT,
  className,
  doubleWidth = false,
}) => {
  
  const baseStyles = "relative h-16 sm:h-20 rounded-2xl text-xl sm:text-2xl font-medium transition-colors select-none flex items-center justify-center overflow-hidden";
  
  const variants = {
    [ButtonVariant.DEFAULT]: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-600",
    [ButtonVariant.ACTION]: "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-glow",
    [ButtonVariant.ACCENT]: "bg-zinc-700 text-indigo-300 hover:bg-zinc-600 active:bg-zinc-500",
    [ButtonVariant.DANGER]: "bg-red-500/10 text-red-400 hover:bg-red-500/20 active:bg-red-500/30",
    [ButtonVariant.GHOST]: "bg-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick(value)}
      className={twMerge(
        baseStyles,
        variants[variant],
        doubleWidth ? "col-span-2" : "col-span-1",
        className
      )}
    >
      {label}
    </motion.button>
  );
};