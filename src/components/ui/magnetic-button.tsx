"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  download?: boolean;
  target?: string;
  rel?: string;
  role?: string;
  ariaSelected?: boolean;
  title?: string;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.22,
  onClick,
  href,
  download,
  target,
  rel,
  role,
  ariaSelected,
  title,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (href) {
    return (
      <motion.div
        ref={ref}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        <a
          href={href}
          download={download}
          target={target}
          rel={rel}
          title={title}
          className={className}
        >
          {children}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block w-full"
    >
      <button
        type="button"
        role={role}
        aria-selected={ariaSelected}
        onClick={onClick}
        title={title}
        className={className}
      >
        {children}
      </button>
    </motion.div>
  );
}
