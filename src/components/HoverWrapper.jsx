"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function HoverWrapper({ children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
    key={'motion'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.03 : 1,
        boxShadow: isHovered
          ? "0 12px 28px rgba(79, 70, 229, 0.25)" // indigo glow
          : "0 6px 16px rgba(0,0,0,0.08)", // soft shadow
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ borderRadius: "16px" }}
    >
      {children}
    </motion.div>
  );
}
