"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left pointer-events-none shadow-[0_0_12px_rgba(16,185,129,0.45)]"
    >
      <div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(90deg, #06b6d4 0%, #10b981 33%, #8b5cf6 66%, #fb7185 100%)",
        }}
      />
    </motion.div>
  );
}
