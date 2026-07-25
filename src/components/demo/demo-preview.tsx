"use client";

import type { BusinessPreset } from "@/types/preset";
import type { IndustryTheme } from "@/theme/theme.types";
import { motion } from "motion/react";
import { Phone, MessageCircle, Star, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrustStrip } from "./sections/trust-strip";
import { WhyChooseUs } from "./sections/why-choose-us";
import { MeetTheTeam } from "./sections/meet-the-team";
import { InsuranceStrip } from "./sections/insurance-strip";
import { FAQAccordion } from "./sections/faq-accordion";
import { LocationHours } from "./sections/location-hours";
import { DiagonalDivider } from "./sections/diagonal-divider";
import { ProgramsGrid } from "./sections/programs-grid";
import { TransformationGallery } from "./sections/transformation-gallery";
import { FacilityTour } from "./sections/facility-tour";
import { ClassSchedule } from "./sections/class-schedule";
import { StoryStrip } from "./sections/story-strip";
import { MenuHighlights } from "./sections/menu-highlights";
import { RestaurantGallery } from "./sections/restaurant-gallery";
import { ReservationsForm } from "./sections/reservations-form";
import { EventsSection } from "./sections/events-section";

// ─── Icon mapping ─────────────────────────────────────

const iconMap: Record<string, React.ReactNode> = {
  Tooth: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M12 2C8.5 2 6 4 6 7c0 2.5 1.5 5 2 6 .5 1 1 3 1 5 0 1.5.5 3 1 4 .5 1 1.5 1 2 1s1.5 0 2-1c.5-1 1-2.5 1-4 0-2 .5-4 1-5 .5-1 2-3.5 2-6 0-3-2.5-5-6-5z" /></svg>,
  Sparkles: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z" /><path d="M18 14l.5 2.5L21 17l-2.5.5L18 20l-.5-2.5L15 17l2.5-.5z" /></svg>,
  ArrowLeftRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M8 3L4 7l4 4" /><path d="M4 7h16" /><path d="M16 21l4-4-4-4" /><path d="M20 17H4" /></svg>,
  Ambulance: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><circle cx="9" cy="19" r="2" /><circle cx="17" cy="19" r="2" /><path d="M3 17h18" /><path d="M7 11h10" /><path d="M12 6v6" /><path d="M9 9h6" /><path d="M5 17V7a2 2 0 012-2h10a2 2 0 012 2v10" /></svg>,
  Baby: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><circle cx="12" cy="12" r="10" /><path d="M8 12c0 2.2 1.8 4 4 4s4-1.8 4-4" /><path d="M9 9h.01" /><path d="M15 9h.01" /></svg>,
  UtensilsCrossed: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>,
  PartyPopper: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M5.8 11.3L2 22l10.7-3.79" /><path d="M4 3h.01" /><path d="M22 8h.01" /><path d="M15 2h.01" /><path d="M22 2l-2 4-4 2 4 2 2 4 2-4 4-2-4-2-2-4z" /><path d="M11 12l6-6" /></svg>,
  Package: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M16.5 9.4L7.55 4.24" /><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.29 7L12 12l8.71-5" /><path d="M12 22V12" /></svg>,
  ChefHat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 011.05-1.54 5 5 0 017.08 0A5.11 5.11 0 0116.59 6 4 4 0 0118 13.87" /><path d="M6 17h12v3a1 1 0 01-1 1H7a1 1 0 01-1-1v-3z" /></svg>,
  User: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>,
  Users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><circle cx="9" cy="7" r="3" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" /><circle cx="17" cy="7" r="3" /><path d="M21 21v-2a4 4 0 00-4-4" /></svg>,
  Dumbbell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M14.4 14.4L9.6 9.6" /><path d="M18.657 5.343a1 1 0 010 1.414l-10.9 10.9a1 1 0 01-1.414 0l-2.828-2.828a1 1 0 010-1.414l10.9-10.9a1 1 0 011.414 0z" /><path d="M21.314 10.686l-1.414 1.414" /><path d="M4.1 19.9l2.828-2.828" /></svg>,
  Apple: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0017 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 00-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" /><path d="M10 2c1 .5 2 2 2 5" /></svg>,
  Heart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
  Zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
};

function getIcon(iconName?: string): React.ReactNode {
  if (!iconName) return null;
  return iconMap[iconName] || <Star className="h-6 w-6" />;
}

// ─── Props ────────────────────────────────────────────

interface DemoPreviewProps {
  preset: BusinessPreset;
  theme?: IndustryTheme;
}

// ─── Theme styles helper ──────────────────────────────

function buildThemeStyles(theme?: IndustryTheme): React.CSSProperties {
  if (!theme) return {};
  const vars = { ...theme.cssVariables };
  vars["--font-heading-stack"] = theme.fontStacks.heading;
  vars["--font-body-stack"] = theme.fontStacks.body;
  return vars as React.CSSProperties;
}

// ─── Star Rating ────────────────────────────────────

function StarRating({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating ? "fill-current" : "fill-none opacity-30"
          )}
          style={{ color: i < rating ? color : "var(--muted-foreground)" }}
        />
      ))}
    </div>
  );
}

// ─── Diagonal divider helper ───────────────────────

function MaybeDivider({ show }: { show?: boolean }) {
  if (!show) return null;
  return <DiagonalDivider direction="down" />;
}

// ─── DemoPreview ──────────────────────────────────────

export function DemoPreview({ preset, theme }: DemoPreviewProps) {
  const primaryColor = theme?.cssVariables?.["--primary"] || preset.primaryColor;
  const ctaColor = theme?.cssVariables?.["--cta"] || primaryColor;
  const useDividers = theme?.layout?.useDiagonalDividers ?? false;
  const useHeroFullBleed = theme?.layout?.heroFullBleed ?? false;
  const isRestaurant = useHeroFullBleed && !useDividers;
  const themeStyles = buildThemeStyles(theme);

  return (
    <div className="w-full" style={themeStyles}>
      {/* ═══════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════ */}
      <section
        className={cn(
          "relative overflow-hidden",
          useDividers || isRestaurant
            ? "min-h-[80vh] flex items-center"
            : "py-24 md:py-32 bg-gradient-to-br from-background to-background-secondary"
        )}
        style={
          isRestaurant
            ? { backgroundColor: "var(--hero-bg)" }
            : undefined
        }
      >
        {/* Hero image treatment */}
        {preset.heroImage && (
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center",
              useDividers && "opacity-20",
              isRestaurant && "opacity-30",
              !useDividers && !isRestaurant && "opacity-15"
            )}
            style={{ backgroundImage: `url(${preset.heroImage})` }}
          />
        )}

        {/* Gradient overlay for full-bleed heroes */}
        {(useDividers || isRestaurant) && (
          <div
            className="absolute inset-0"
            style={{
              background: useDividers
                ? "linear-gradient(to right, var(--background) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.3) 100%)"
                : "linear-gradient(to top, var(--hero-bg) 0%, rgba(255,248,240,0.5) 40%, rgba(255,248,240,0.7) 100%)",
            }}
          />
        )}

        {/* Gym: diagonal accent strip */}
        {useDividers && (
          <div
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{
              background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
              clipPath: "polygon(0 0, 100% 100%, 100% 100%, 0 100%)",
              opacity: 0.08,
            }}
          />
        )}

        {/* Restaurant: accent glow */}
        {isRestaurant && (
          <div
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[60%] h-40 rounded-full blur-3xl"
            style={{ backgroundColor: "var(--hero-glow)" }}
          />
        )}

        {/* Decorative gradient orbs */}
        <div
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full opacity-8 blur-3xl"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="container relative z-10 py-24 md:py-32">
          <div className={cn("max-w-3xl", useDividers ? "text-left" : "mx-auto text-center")}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block text-xs font-medium uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
              style={{
                color: primaryColor,
                backgroundColor: `${primaryColor}15`,
                border: `1px solid ${primaryColor}30`,
              }}
            >
              {preset.industryLabel}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                "font-bold tracking-tight mb-6 font-heading",
                useDividers
                  ? "text-5xl md:text-7xl lg:text-8xl uppercase"
                  : "text-4xl md:text-6xl lg:text-7xl"
              )}
            >
              {preset.businessName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn(
                "max-w-xl mb-10 leading-relaxed",
                useDividers ? "text-lg md:text-xl" : "text-lg md:text-xl mx-auto",
                isRestaurant ? "text-muted-foreground" : "text-muted-foreground"
              )}
            >
              {preset.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href={`tel:${preset.phone}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: ctaColor,
                  color: theme?.cssVariables?.["--cta-foreground"] || "#FFFFFF",
                }}
              >
                {preset.ctaLabel}
                <ChevronRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TRUST STRIP
          ═══════════════════════════════════════════════ */}
      {preset.trustStats && preset.trustStats.length > 0 && (
        <>
          <MaybeDivider show={useDividers} />
          <TrustStrip stats={preset.trustStats} />
        </>
      )}

      {/* ═══════════════════════════════════════════════
          PROGRAMS / CLASSES (gym)
          ═══════════════════════════════════════════════ */}
      {preset.programs && preset.programs.length > 0 && (
        <>
          <MaybeDivider show={useDividers} />
          <ProgramsGrid programs={preset.programs} />
        </>
      )}

      {/* ═══════════════════════════════════════════════
          SERVICES (with per-service pricing — dental)
          ═══════════════════════════════════════════════ */}
      {!preset.programs && !preset.menu && preset.services && preset.services.length > 0 && (
        <>
          <MaybeDivider show={useDividers} />
          <section className="py-20 md:py-28 bg-background">
            <div className="container">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-heading">
                  Our Services
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Comprehensive solutions tailored to your needs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {preset.services.map((service, i) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group relative rounded-2xl border border-border/50 bg-card-background/50 p-6 transition-all duration-300"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${primaryColor}40`;
                      e.currentTarget.style.backgroundColor = `${primaryColor}08`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.backgroundColor = "";
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${primaryColor}15`,
                        color: primaryColor,
                      }}
                    >
                      {getIcon(service.icon)}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 font-heading">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>
                    {service.startingPrice && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: `${ctaColor}15`,
                            color: ctaColor,
                          }}
                        >
                          From {service.startingPrice}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══════════════════════════════════════════════
          PRICING (gym: monthly tiers / others: fallback)
          ═══════════════════════════════════════════════ */}
      {preset.pricing && preset.pricing.length > 0 && !preset.menu && (
        <>
          <MaybeDivider show={useDividers} />
          <section className="py-20 md:py-28" style={{ backgroundColor: useDividers ? "var(--background)" : "var(--background)" }}>
            <div className="container">
              <div className="text-center mb-16">
                <h2 className={cn(
                  "font-bold tracking-tight mb-4 font-heading",
                  useDividers ? "text-4xl md:text-5xl uppercase" : "text-3xl md:text-4xl"
                )}>
                  {useDividers ? "Membership Plans" : "Pricing Plans"}
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  {useDividers
                    ? "No hidden fees. No long-term contracts. Cancel anytime."
                    : "Flexible options designed to fit every need and budget."}
                </p>
              </div>

              <div
                className={cn(
                  "grid gap-6 max-w-5xl mx-auto",
                  preset.pricing.length === 3
                    ? "grid-cols-1 md:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                )}
              >
                {preset.pricing.map((plan, i) => {
                  const isMiddle = preset.pricing && preset.pricing.length === 3 && i === 1;

                  return (
                    <motion.div
                      key={plan.tier}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                      className={cn(
                        "relative rounded-2xl border p-6 transition-all duration-300",
                        isMiddle
                          ? "scale-105"
                          : "hover:border-border",
                        useDividers && isMiddle ? "shadow-lg" : ""
                      )}
                      style={{
                        borderColor: isMiddle ? `${primaryColor}40` : "var(--border)",
                        backgroundColor: useDividers && isMiddle
                          ? "color-mix(in srgb, var(--primary) 6%, var(--card-background))"
                          : "var(--card-background)",
                      }}
                    >
                      {isMiddle && (
                        <div
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: primaryColor,
                            color: theme?.cssVariables?.["--primary-foreground"] || "#090B10",
                          }}
                        >
                          Best Value
                        </div>
                      )}

                      <h3 className={cn("font-semibold mb-1 font-heading", useDividers ? "text-xl uppercase tracking-wide" : "text-lg")}>
                        {plan.tier}
                      </h3>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className={cn("font-bold", useDividers ? "text-4xl" : "text-3xl")}>
                          {plan.price}
                        </span>
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <svg className="h-4 w-4 mt-0.5 shrink-0" style={{ color: primaryColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                        style={{
                          backgroundColor: isMiddle ? primaryColor : `${primaryColor}15`,
                          color: isMiddle
                            ? theme?.cssVariables?.["--primary-foreground"] || "#090B10"
                            : primaryColor,
                        }}
                      >
                        {useDividers ? `Join ${plan.tier}` : `Choose ${plan.tier}`}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══════════════════════════════════════════════
          WHY CHOOSE US (dental)
          ═══════════════════════════════════════════════ */}
      {preset.whyChooseUs && preset.whyChooseUs.length > 0 && (
        <>
          <MaybeDivider show={useDividers} />
          <WhyChooseUs items={preset.whyChooseUs} />
        </>
      )}

      {/* ═══════════════════════════════════════════════
          MEET THE TEAM / TRAINERS
          ═══════════════════════════════════════════════ */}
      {preset.team && preset.team.length > 0 && (
        <>
          <MaybeDivider show={useDividers} />
          <MeetTheTeam
            members={preset.team}
            title={useDividers ? "Meet Your Coaches" : undefined}
            subtitle={useDividers ? "World-class trainers who care about your progress as much as you do." : undefined}
            headingClassName={useDividers ? "text-4xl md:text-5xl uppercase" : undefined}
          />
        </>
      )}

      {/* ═══════════════════════════════════════════════
          TRANSFORMATION GALLERY (gym)
          ═══════════════════════════════════════════════ */}
      {preset.gallery && preset.gallery.length > 0 && (
        <>
          <MaybeDivider show={useDividers} />
          <TransformationGallery items={preset.gallery} />
        </>
      )}

      {/* ═══════════════════════════════════════════════
          FACILITY TOUR (gym)
          ═══════════════════════════════════════════════ */}
      {preset.facility && preset.facility.length > 0 && (
        <>
          <MaybeDivider show={useDividers} />
          <FacilityTour items={preset.facility} />
        </>
      )}

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS (dental & gym — restaurant renders after events)
          ═══════════════════════════════════════════════ */}
      {!preset.menu && (
        <>
      <MaybeDivider show={useDividers} />
      <section className={cn("py-20 md:py-28", useDividers ? "bg-background-secondary" : "bg-background-secondary")}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className={cn(
              "font-bold tracking-tight mb-4 font-heading",
              useDividers ? "text-4xl md:text-5xl uppercase" : "text-3xl md:text-4xl"
            )}>
              {useDividers ? "Real Results" : "What Our Patients Say"}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {useDividers
                ? "Don't take our word for it — hear from people who showed up and transformed."
                : "Real feedback from real people — names have been kept general for privacy."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preset.testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className="relative rounded-2xl border border-border/40 bg-card-background/40 p-6"
              >
                {t.rating && <StarRating rating={t.rating} color="#F59E0B" />}
                <div
                  className="absolute top-4 right-4 text-5xl leading-none opacity-10"
                  style={{ color: primaryColor }}
                >
                  &ldquo;
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 relative z-10 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-border/30 pt-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: `${primaryColor}20`,
                      color: primaryColor,
                    }}
                  >
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
        </>
      )}

      {/* ═══════════════════════════════════════════════
          RESTAURANT: TESTIMONIALS (after events)
          ═══════════════════════════════════════════════ */}
      {preset.menu && preset.testimonials.length > 0 && (
        <section className="py-20 md:py-28 bg-background-secondary">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-heading">
                What Our Guests Say
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Genuine reviews from diners who have experienced Locale Kitchen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {preset.testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                  className="relative rounded-2xl border border-border/40 bg-card-background/40 p-6"
                >
                  {t.rating && <StarRating rating={t.rating} color="#F59E0B" />}
                  <div
                    className="absolute top-4 right-4 text-5xl leading-none opacity-10"
                    style={{ color: "var(--primary)" }}
                  >
                    &ldquo;
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 relative z-10 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-border/30 pt-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--primary) 20%, transparent)",
                        color: "var(--primary)",
                      }}
                    >
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          CLASS SCHEDULE (gym)
          ═══════════════════════════════════════════════ */}
      {preset.classSchedule && preset.classSchedule.length > 0 && (
        <>
          <MaybeDivider show={useDividers} />
          <ClassSchedule schedule={preset.classSchedule} />
        </>
      )}

      {/* ═══════════════════════════════════════════════
          RESTAURANT: STORY STRIP
          ═══════════════════════════════════════════════ */}
      {preset.story && <StoryStrip story={preset.story} />}

      {/* ═══════════════════════════════════════════════
          RESTAURANT: MENU HIGHLIGHTS
          ═══════════════════════════════════════════════ */}
      {preset.menu && preset.menu.length > 0 && (
        <MenuHighlights items={preset.menu} />
      )}

      {/* ═══════════════════════════════════════════════
          RESTAURANT: GALLERY
          ═══════════════════════════════════════════════ */}
      {preset.galleryImages && preset.galleryImages.length > 0 && (
        <RestaurantGallery images={preset.galleryImages} />
      )}

      {/* ═══════════════════════════════════════════════
          RESTAURANT: RESERVATIONS FORM
          ═══════════════════════════════════════════════ */}
      {preset.reservationInfo && (
        <ReservationsForm
          note={preset.reservationInfo.note}
          phoneReservation={preset.reservationInfo.phoneReservation}
        />
      )}

      {/* ═══════════════════════════════════════════════
          RESTAURANT: EVENTS / PRIVATE DINING
          ═══════════════════════════════════════════════ */}
      {preset.events && preset.events.length > 0 && (
        <EventsSection events={preset.events} />
      )}

      {/* ═══════════════════════════════════════════════
          INSURANCE & PAYMENT (dental)
          ═══════════════════════════════════════════════ */}
      {preset.insurance && <InsuranceStrip insurance={preset.insurance} />}

      {/* ═══════════════════════════════════════════════
          FAQ (dental)
          ═══════════════════════════════════════════════ */}
      {preset.faq && preset.faq.length > 0 && (
        <>
          <MaybeDivider show={useDividers} />
          <FAQAccordion items={preset.faq} />
        </>
      )}

      {/* ═══════════════════════════════════════════════
          LOCATION / HOURS
          ═══════════════════════════════════════════════ */}
      {preset.location && <LocationHours location={preset.location} />}

      {/* ═══════════════════════════════════════════════
          FINAL CTA BANNER
          ═══════════════════════════════════════════════ */}
      <section
        className={cn("py-20 md:py-28 relative overflow-hidden", useDividers && "bg-background-secondary")}
        style={useDividers ? undefined : {
          background: `linear-gradient(135deg, ${primaryColor}20 0%, ${ctaColor}10 100%)`,
        }}
      >
        {/* Decorative circle */}
        <div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-[0.06] blur-3xl"
          style={{ backgroundColor: ctaColor }}
        />

        <div className="container text-center relative z-10">
          {useDividers ? (
            <>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading uppercase">
                Ready to Transform?
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Your first week is on us. No commitment, no initiation fees — just
                show up and experience the difference.
              </p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="h-5 w-5" style={{ color: ctaColor }} />
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: ctaColor }}>
                  Limited spots available
                </span>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-heading">
                {isRestaurant
                  ? "Ready for an Unforgettable Evening?"
                  : "Ready to Experience Comfortable Dentistry?"}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                {isRestaurant
                  ? "Book your table tonight and discover why Locale Kitchen is Portland's favourite neighbourhood restaurant."
                  : "Schedule your free consultation today. No pressure, no commitment."}
              </p>
            </>
          )}
          <a
            href={`tel:${preset.phone}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            style={{
              backgroundColor: ctaColor,
              color: theme?.cssVariables?.["--cta-foreground"] || "#FFFFFF",
            }}
          >
            {preset.ctaLabel}
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STICKY MOBILE CTA BAR
          ═══════════════════════════════════════════════ */}
      <div
        className="sticky bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl md:hidden"
        style={{
          backgroundColor: `${ctaColor}08`,
          borderColor: `${ctaColor}20`,
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22C55E" }} />
            <span className="text-xs font-medium">{preset.businessName}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${preset.phone}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: ctaColor,
                color: theme?.cssVariables?.["--cta-foreground"] || "#FFFFFF",
              }}
            >
              {preset.secondaryCtaLabel || (isRestaurant ? "Book" : "Call")}
            </a>
            {preset.whatsapp && (
              <a
                href={`https://wa.me/${preset.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: "#25D366",
                  color: "#FFFFFF",
                }}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {useDividers ? "Join" : "Book"}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
