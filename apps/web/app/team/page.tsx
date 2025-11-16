"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TeamCard from "@/components/TeamCard";
import ExecomSection from "@/components/ExecomSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  year: string;
}

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("2025-2026");

  const years = ["2022-2023", "2023-2024", "2024-2025", "2025-2026"];

  useEffect(() => {
    fetch("/team.json")
      .then((res) => res.json())
      .then((data) => {
        setTeamMembers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading team data:", error);
        setLoading(false);
      });
  }, []);

  const filteredMembers = teamMembers.filter(
    (member) => member.year === selectedYear
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white overflow-hidden py-8">
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex justify-center mb-8 px-4 sm:px-6"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-lg p-1.5 backdrop-blur-sm">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`relative px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-300 ${
                    selectedYear === year
                      ? "text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {year}
                  {selectedYear === year && (
                    <motion.div
                      layoutId="activeYear"
                      className="absolute inset-0 bg-zinc-800 rounded-md border border-blue-900/50 shadow-lg shadow-blue-900/20"
                      style={{ zIndex: -1 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.1,
            }}
            className="text-center mb-12 sm:mb-16 px-4 sm:px-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-[1.2] pb-3 overflow-visible">
              <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                Our Governing Body
              </span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Meet the visionary leaders who guide our organization towards
              excellence and innovation.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-wrap justify-center gap-6 px-4 sm:px-6 lg:px-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-56 sm:w-64 md:w-72 aspect-[3/4] bg-zinc-900 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <motion.div
              key={selectedYear}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-center gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 pt-4 pb-8"
            >
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={`${member.name}-${index}`}
                  variants={itemVariants}
                  className="w-56 sm:w-64 md:w-72"
                >
                  <TeamCard member={member} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <ExecomSection selectedYear={selectedYear} />
      </div>
      <Footer />
    </>
  );
};

export default TeamPage;

