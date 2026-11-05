"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function RevealSection({ children, className = "", id }: RevealSectionProps) {
  return (
    <motion.section
      id={id}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05, margin: "0px 0px 250px 0px" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

interface RevealItemProps {
  children: React.ReactNode;
  className?: string;
}

export function RevealItem({ children, className = "" }: RevealItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
