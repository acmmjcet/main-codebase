import React, { memo } from "react";

interface TeamCardProps {
  member: {
    name: string;
    role: string;
    image: string;
  };
}

const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  return (
    <div className="group relative h-full">
      <div className="relative h-full transition-all duration-300 group-hover:-translate-y-2 group-hover:z-50">
        <div className="relative h-full rounded-2xl overflow-hidden bg-zinc-900 border-2 border-zinc-800 group-hover:border-blue-500/50">
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-900/40 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

          <div className="aspect-[3/4] relative bg-zinc-800 rounded-t-2xl overflow-hidden">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="p-5 relative z-10">
            <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-100 transition-colors">
              {member.name}
            </h3>
            <p className="text-blue-500 text-sm font-medium uppercase tracking-wide">
              {member.role}
            </p>
          </div>

          <div className="absolute inset-0 ring-2 ring-inset ring-blue-500/0 group-hover:ring-blue-500/20 transition-all duration-300 pointer-events-none z-20" />
        </div>
      </div>
    </div>
  );
};

export default memo(TeamCard);
