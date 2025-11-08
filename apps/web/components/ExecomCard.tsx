"use client";

import React, { useRef, memo } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface ExecomCardProps {
  member: {
    name: string;
    designation: string;
    image: string;
  };
  index: number;
}

const ExecomCard: React.FC<ExecomCardProps> = ({ member, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [10, -10]);
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);
  const springX = useSpring(rotateX, { stiffness: 400, damping: 25 });
  const springY = useSpring(rotateY, { stiffness: 400, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const posX = e.clientX - rect.left - rect.width / 2;
    const posY = e.clientY - rect.top - rect.height / 2;
    x.set(posX);
    y.set(posY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.03,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <motion.div
        ref={cardRef}
        className="relative group w-[280px] h-[380px] bg-zinc-900 border border-zinc-800 
                   rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-blue-900/40 
                   hover:border-blue-500/50 transition-all duration-500"
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
          rotateX: springX,
          rotateY: springY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-900/40 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.25), transparent 70%)",
            opacity: useTransform(x, [-200, 0, 200], [0, 0.3, 0]),
          }}
        />

        <motion.div
          className="relative w-full h-[70%] overflow-hidden"
          style={{
            transform: "translateZ(40px)",
          }}
        >
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </motion.div>

        <motion.div
          className="absolute bottom-0 w-full h-[30%] bg-zinc-900/90 text-center p-4 flex flex-col justify-center"
          style={{
            transform: "translateZ(60px)",
          }}
        >
          <h3 className="text-white font-semibold text-lg mb-1">
            {member.name}
          </h3>
          <p className="text-blue-400 text-xs font-medium uppercase tracking-wide">
            {member.designation}
          </p>
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-xl ring-2 ring-blue-500/0 group-hover:ring-blue-500/40 transition-all duration-500"
          style={{ transform: "translateZ(80px)" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default memo(ExecomCard);
