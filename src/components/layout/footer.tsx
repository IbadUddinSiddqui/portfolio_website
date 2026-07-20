"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { navLinks, socialLinks, siteConfig } from "@/lib/constants";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Footer
 *
 * Premium footer with:
 * - Animated gradient divider at top
 * - Brand + tagline + social icons with hover lift
 * - Navigation + connect columns
 * - Back-to-top button with spring animation
 * - Consistent spacing
 */
export function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative mt-auto border-t border-border/30 bg-background overflow-hidden">
      {/* Animated gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, var(--primary) 30%, var(--secondary) 70%, transparent 100%)",
          opacity: 0.4,
        }}
      />

      {/* Subtle background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-32 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgb(99 102 241 / 0.05), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container relative py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="sm:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group w-fit"
              aria-label={`${siteConfig.name} — home`}
            >
              <motion.div
                className="relative w-9 h-9 rounded-xl overflow-hidden"
                whileHover={{ scale: 1.08, rotate: -5 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <span className="relative z-10 flex items-center justify-center w-full h-full text-white text-sm font-bold">
                  {siteConfig.name.charAt(0).toUpperCase()}
                </span>
              </motion.div>
              <span className="text-base font-semibold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
                {siteConfig.name}
              </span>
            </Link>

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {siteConfig.tagline}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredSocial(label)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200",
                    hoveredSocial === label
                      ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_12px_rgb(99_102_241_/_0.15)]"
                      : "border-border/60 bg-card/50 text-muted-foreground hover:text-foreground"
                  )}
                  aria-label={label}
                >
                  <Icon className="h-[14px] w-[14px]" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
              Connect
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com"}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                Send email
              </a>
              <Link
                href="/blog/feed.xml"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                RSS feed
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                Contact form
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()}&nbsp;{siteConfig.name}. All rights reserved.
          </p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="group flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <div className="w-5 h-5 rounded-md border border-border/60 bg-muted/50 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-200">
              <ArrowUp className="h-3 w-3" />
            </div>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
