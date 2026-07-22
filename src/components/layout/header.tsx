"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { navLinks, socialLinks, siteConfig } from "@/lib/constants";
import { MobileNav } from "@/components/layout/mobile-nav";
/**
 * Header
 *
 * Premium navigation personalized for Ibad Uddin:       * - Dark theme matching the hero section
       * - Electric cyan accents inspired by AI/engineering
       * - Profile photo logo with cyan circular frame
 * - Social links (GitHub, LinkedIn)
 * - Transparent → glassmorphism on scroll
 * - Animated warm gradient border on scroll
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
      className={cn(
        "fixed top-0 right-0 left-0 z-[50] transition-all duration-500 ease-out",
        scrolled
          ? "bg-background/80 backdrop-blur-2xl shadow-glow-line"
          : "bg-transparent"
      )}
    >
      {/* Animated warm gradient border line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0"
        )}
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(56,189,248,0.4), rgba(37,99,235,0.2), transparent)",
        }}
      />

      <div
        className={cn(
          "container flex items-center justify-between transition-all duration-500",
          scrolled ? "h-14" : "h-16"
        )}
      >
        {/* Logo — profile photo with warm gold circular frame */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label={`${siteConfig.name} — home`}
        >
          <motion.div
            className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/50 group-hover:ring-primary/80 transition-all duration-300"
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Image
              src="/images/logo.png"
              alt={siteConfig.name}
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </motion.div>
          <span className="text-sm font-semibold tracking-tight hidden sm:inline text-muted-foreground group-hover:text-foreground transition-colors duration-200">
            Ibad Uddin
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-0.5"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            const isHovered = hoveredLink === href;

            return (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => setHoveredLink(href)}
                onMouseLeave={() => setHoveredLink(null)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Hover / active background pill */}
                {(isActive || isHovered) && (
                  <motion.span
                    layoutId="nav-bg"
                    className="absolute inset-0 rounded-lg bg-white/5"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <span className="relative z-10">{label}</span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side — social links + mobile nav */}
        <div className="flex items-center gap-0.5">
          {/* Social links */}
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-white/5 transition-all duration-200"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}

          <MobileNav />
        </div>
      </div>
    </motion.header>
  );
}
