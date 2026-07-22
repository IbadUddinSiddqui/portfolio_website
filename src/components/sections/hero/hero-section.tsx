"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ThreeBulbScene } from "./three-bulb-scene";

export function HeroSection() {
  const reduced = useReducedMotion();

  const ease = [0.25, 0.1, 0, 1] as const;
  const item = (i: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0.2 : 0.6,
      delay: 0.15 + i * 0.1,
      ease,
    },
  });

  return (
    <section
      className="relative w-full h-screen bg-hero-bg overflow-hidden font-sans text-text-primary"
      aria-label="Hero"
    >
      {/* ── Three.js 3D Bulb Scene ── */}
      <ThreeBulbScene />

      {/* ── UI Content Layer - on top of 3D canvas ── */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center mt-20 md:mt-32">
          <motion.h1
            className="text-6xl md:text-9xl font-extrabold tracking-tighter uppercase select-none cursor-default bg-transparent py-4 text-white/5 backdrop-blur-[3px] transition-all duration-700 hover:text-white/15"
            style={{
              WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.16)",
              textShadow:
                "0 0 30px rgba(56, 189, 248, 0.12), 0 0 60px rgba(56, 189, 248, 0.04)",
            }}
            {...item(0)}
          >
            IBAD UDDIN
          </motion.h1>

          <motion.p
            className="text-gray-400 text-xs md:text-sm uppercase tracking-hero font-light mt-8"
            {...item(1)}
          >
            Full Stack Developer &bull; AI Engineer &bull; Electronics Innovator
          </motion.p>

          <motion.p
            className="max-w-[620px] text-gray-500 mt-6 leading-relaxed font-light text-sm md:text-base"
            {...item(2)}
          >
            I build modern web experiences, intelligent AI systems, and
            immersive digital products that combine elegant design with
            cutting-edge technology.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-12"
            {...item(3)}
          >
            <Link
              href="/projects"
              className="px-8 py-3 border border-white/10 rounded-full hover:bg-white/5 transition-all backdrop-blur-md cursor-pointer hover:border-white/20 hover:scale-105 active:scale-95 shadow-glow-cyan text-sm uppercase tracking-wider inline-block"
            >
              View Portfolio
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-transparent bg-white/5 rounded-full hover:bg-white/10 transition-all backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 text-sm uppercase tracking-wider inline-block"
            >
              Contact Me
            </Link>
          </motion.div>
        </div>
      </main>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="text-xxs uppercase tracking-scroll text-gray-500/40 font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 text-gray-500/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
