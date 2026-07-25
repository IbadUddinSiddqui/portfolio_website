"use client";

import { motion } from "motion/react";
import type { TeamMember } from "@/types/preset";
import { cn } from "@/lib/utils";

// ─── Avatar placeholder with initials ─────────────────

function TeamAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // Generate a soft gradient based on the name for visual variety
  const hue = (name.length * 37) % 360;
  const grad1 = `hsl(${hue}, 60%, 60%)`;
  const grad2 = `hsl(${(hue + 40) % 360}, 55%, 50%)`;

  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md"
      style={{
        background: `linear-gradient(135deg, ${grad1}, ${grad2})`,
      }}
    >
      {initials}
    </div>
  );
}

// ─── MeetTheTeam ──────────────────────────────────────

interface MeetTheTeamProps {
  members: TeamMember[];
  title?: string;
  subtitle?: string;
  headingClassName?: string;
}

export function MeetTheTeam({ members, title, subtitle, headingClassName }: MeetTheTeamProps) {
  return (
    <section className="py-20 md:py-28 bg-background-secondary">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className={cn("font-bold tracking-tight mb-4 font-heading", headingClassName || "text-3xl md:text-4xl")}>
            {title || "Meet Our Team"}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {subtitle || "Caring professionals dedicated to your comfort and smile."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-border/50 bg-card-background/50 p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                borderColor: "var(--border)",
              }}
            >
              <div className="flex justify-center mb-4">
                <TeamAvatar name={member.name} />
              </div>

              <h3 className="text-base font-semibold font-heading mb-0.5">
                {member.name}
              </h3>
              <p
                className="text-xs font-medium mb-3"
                style={{ color: "var(--primary)" }}
              >
                {member.role}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
