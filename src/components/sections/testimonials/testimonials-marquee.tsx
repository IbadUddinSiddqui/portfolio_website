"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Engineering Manager",
    company: "Tech Corp",
    content:
      "An exceptional developer with a keen eye for design. Every project they touch becomes more polished, performant, and user-friendly. A true asset to any team.",
    avatar: "SC",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Marcus Rivera",
    role: "CTO",
    company: "StartupXYZ",
    content:
      "Working with them was a game-changer. They architected our entire frontend from scratch — performance improvements were immediately measurable in our metrics.",
    avatar: "MR",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Emily Watson",
    role: "Product Designer",
    company: "Agency.io",
    content:
      "Rare combination of deep technical skill and strong design sensibility. They don't just implement designs — they elevate them.",
    avatar: "EW",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "James Park",
    role: "Open Source Maintainer",
    company: "GitHub",
    content:
      "Their contributions were invaluable — clean code, thorough documentation, and a genuine passion for building great software that others can build on.",
    avatar: "JP",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Dr. Lisa Martinez",
    role: "Professor",
    company: "University of Technology",
    content:
      "One of the most talented students I've had. Their ability to grasp complex concepts and immediately apply them to real-world systems was consistently impressive.",
    avatar: "LM",
    color: "from-amber-500 to-orange-500",
  },
];

function TestimonialCard({
  t,
  className,
}: {
  t: (typeof testimonials)[0];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-[340px] shrink-0 flex flex-col rounded-2xl p-6",
        "bg-card/60 border border-border/50 backdrop-blur-sm",
        "hover:border-primary/25 hover:bg-card/80",
        "transition-all duration-300",
        className
      )}
    >
      {/* Quote icon */}
      <svg
        className="h-5 w-5 text-primary/30 mb-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
      </svg>

      {/* Content */}
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-4">
        {t.content}
      </p>

      {/* Attribution */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/40">
        <div
          className={cn(
            "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-[10px] font-bold text-white shrink-0",
            t.color
          )}
          aria-hidden="true"
        >
          {t.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{t.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {t.role} · {t.company}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * TestimonialsMarquee
 *
 * Two-row infinite marquee — top row scrolls right, bottom row scrolls left.
 * Creates a premium, dynamic feel. Edge fade via mask.
 * Pauses on hover. Respects reduced motion.
 */
export function TestimonialsMarquee() {
  const prefersReducedMotion = useReducedMotion();

  const row1 = [...testimonials, ...testimonials];
  const row2 = [...testimonials.slice(2), ...testimonials.slice(0, 2), ...testimonials.slice(2), ...testimonials.slice(0, 2)];

  return (
    <section
      className="py-section overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mb-14">
        <FadeIn>
          <div className="section-label mb-4">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Testimonials
          </div>
          <h2
            id="testimonials-heading"
            className="text-h2 font-heading font-bold tracking-tight mb-3"
          >
            What people say
          </h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Kind words from colleagues, clients, and collaborators I've had the
            pleasure of working with.
          </p>
        </FadeIn>
      </div>

      {/* Row 1 — scrolls right */}
      <div
        className="relative overflow-hidden mask-fade-edges mb-4"
        role="region"
        aria-label="Testimonials marquee"
      >
        <div
          className={cn(
            "flex gap-4 py-1",
            !prefersReducedMotion &&
              "animate-marquee hover:[animation-play-state:paused]"
          )}
          style={prefersReducedMotion ? {} : { animationDuration: "40s" }}
        >
          {row1.map((t, i) => (
            <TestimonialCard key={`r1-${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls left (reversed) */}
      <div
        className="relative overflow-hidden mask-fade-edges"
        aria-hidden="true"
      >
        <div
          className={cn(
            "flex gap-4 py-1",
            !prefersReducedMotion &&
              "animate-marquee hover:[animation-play-state:paused]"
          )}
          style={
            prefersReducedMotion
              ? {}
              : {
                  animationDuration: "50s",
                  animationDirection: "reverse",
                }
          }
        >
          {row2.map((t, i) => (
            <TestimonialCard key={`r2-${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
