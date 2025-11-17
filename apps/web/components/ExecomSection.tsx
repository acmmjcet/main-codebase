"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExecomCard from "./ExecomCard";
import MultiSelect from "./MultiSelect";

interface ExecomMember {
  name: string;
  designation?: string;
  role?: string;
  image: string;
  year: string;
}

interface ExecomSectionProps {
  selectedYear: string;
}

const ExecomSection: React.FC<ExecomSectionProps> = ({ selectedYear }) => {
  const [execomMembers, setExecomMembers] = useState<ExecomMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    fetch("/execom.json")
      .then((res) => res.json())
      .then((data) => {
        setExecomMembers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading execom data:", error);
        setLoading(false);
      });
  }, []);

  const availableRoles = useMemo(() => {
    const yearMembers = execomMembers.filter(
      (member) => member.year === selectedYear
    );
    const roles = [
      ...new Set(
        yearMembers.map((member) => member.designation || member.role || "")
      ),
    ].filter(Boolean);
    return roles.sort();
  }, [execomMembers, selectedYear]);

  const filteredMembers = useMemo(() => {
    let members = execomMembers.filter(
      (member) => member.year === selectedYear
    );

    if (selectedRoles.length > 0) {
      members = members.filter((member) =>
        selectedRoles.includes(member.designation || member.role || "")
      );
    }

    return members;
  }, [execomMembers, selectedYear, selectedRoles]);

  useEffect(() => {
    setSelectedRoles([]);
  }, [selectedYear]);

  const handleRoleChange = useCallback((roles: string[]) => {
    setSelectedRoles(roles);
  }, []);

  return (
    <section className="min-h-screen text-white py-12 sm:py-16">
      <div className="px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Our Execom Members
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg mt-3 sm:mt-4 max-w-2xl mx-auto px-4">
            Meet the passionate team members who bring our vision to life year
            after year.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 sm:mb-14 max-w-4xl mx-auto"
        >
          <MultiSelect
            options={availableRoles}
            selectedOptions={selectedRoles}
            onChange={handleRoleChange}
          />
        </motion.div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-[280px] h-[380px] bg-zinc-900 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              key={
                selectedRoles.length === 0
                  ? `${selectedYear}-all`
                  : `${selectedYear}-${selectedRoles[0]}`
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10 xl:gap-12"
            >
              {filteredMembers.map((member, index) => (
                <ExecomCard
                  key={`${member.name}-${member.designation || member.role}`}
                  member={{
                    name: member.name,
                    designation: member.designation || member.role || "",
                    image: member.image,
                  }}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <p className="text-zinc-500 text-base sm:text-lg">
              No execom members found for {selectedYear}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ExecomSection;
