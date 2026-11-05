"use client";

import React from "react";
import { motion } from "framer-motion";

interface EditorialRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function EditorialReveal({
  children,
  className = "",
  delay = 0,
}: EditorialRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeaderReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.header>
  );
}
