"use client";

// app/[locale]/(auth)/_components/AuthCard.tsx

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "w-full rounded-2xl border border-border/60",
        "bg-card/80 backdrop-blur-sm shadow-sm",
        "p-7 sm:p-8",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
