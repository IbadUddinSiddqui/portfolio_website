import type { IndustryTheme } from "./theme.types";

/**
 * Gym / Fitness Center — "Nova Fitness"
 *
 * Emotional goal: energy, intensity, motivation.
 * Near-black background (#0A0A0A), electric lime accent (#A3E635),
 * orange secondary (#F97316), white text.
 * Headings: Bebas Neue (bold, condensed). Body: Inter.
 * Uses diagonal section dividers.
 */
const gymTheme: IndustryTheme = {
  id: "gym",
  name: "Fitness Center",

  cssVariables: {
    /* ─── Background / Surface ─────────────────────── */
    "--background": "#0A0A0A",
    "--background-secondary": "#171717",
    "--background-elevated": "#1F1F1F",
    "--background-hover": "#262626",
    "--foreground": "#FAFAFA",
    "--card": "#171717",
    "--card-foreground": "#FAFAFA",
    "--card-background": "#171717",
    "--card-border": "#262626",
    "--popover": "#171717",
    "--popover-foreground": "#FAFAFA",

    /* ─── Surface Tokens ───────────────────────────── */
    "--surface": "#171717",
    "--surface-secondary": "#1F1F1F",
    "--surface-glass": "rgba(255,255,255,0.05)",

    /* ─── Brand Accents ────────────────────────────── */
    "--primary": "#A3E635",
    "--primary-foreground": "#0A0A0A",
    "--secondary": "#F97316",
    "--secondary-foreground": "#0A0A0A",
    "--accent": "#A3E635",
    "--accent-foreground": "#0A0A0A",
    "--muted": "#262626",
    "--muted-foreground": "#A3A3A3",

    /* ─── Link / CTA ───────────────────────────────── */
    "--cta": "#F97316",
    "--cta-foreground": "#FFFFFF",
    "--cta-hover": "#FB923C",
    "--link": "#A3E635",
    "--link-hover": "#BEF264",

    /* ─── Button Tokens ────────────────────────────── */
    "--button-primary": "#A3E635",
    "--button-primary-hover": "#BEF264",
    "--button-primary-foreground": "#0A0A0A",
    "--button-secondary": "transparent",
    "--button-secondary-hover": "rgba(163,230,53,0.1)",
    "--button-secondary-foreground": "#FAFAFA",

    /* ─── Status ───────────────────────────────────── */
    "--success": "#22C55E",
    "--warning": "#F97316",
    "--error": "#EF4444",
    "--info": "#A3E635",

    /* ─── Borders / Inputs / Rings ─────────────────── */
    "--border": "#262626",
    "--border-light": "rgba(255,255,255,0.06)",
    "--border-focus": "#A3E635",
    "--input": "#333333",
    "--input-background": "rgba(255,255,255,0.03)",
    "--input-border": "#333333",
    "--input-focus": "#A3E635",
    "--ring": "#A3E635",

    /* ─── Navbar ───────────────────────────────────── */
    "--navbar-background": "rgba(10,10,10,0.9)",
    "--navbar-border": "rgba(163,230,53,0.15)",
    "--navbar-active": "#A3E635",

    /* ─── Hero ─────────────────────────────────────── */
    "--hero-bg": "#0A0A0A",
    "--hero-glow": "rgba(163,230,53,0.15)",
    "--hero-highlight": "#A3E635",
    "--hero-gradient": "linear-gradient(135deg, #A3E635, #F97316)",

    /* ─── Badge ────────────────────────────────────── */
    "--badge-primary": "#A3E635",
    "--badge-primary-foreground": "#0A0A0A",
    "--badge-secondary": "#F97316",
    "--badge-secondary-foreground": "#0A0A0A",
    "--badge-destructive": "#7F1D1D",
    "--badge-destructive-foreground": "#FAFAFA",

    /* ─── Glass/Misc ──────────────────────────────── */
    "--glass": "rgba(255,255,255,0.05)",

    /* ─── Text Tones ──────────────────────────────── */
    "--text-primary": "#FAFAFA",
    "--text-secondary": "#A3A3A3",
    "--text-muted": "#737373",
    "--text-disabled": "#525252",
  },

  fontStacks: {
    heading: "var(--font-bebas-neue), 'Bebas Neue', sans-serif",
    body: "var(--font-inter), 'Inter', system-ui, sans-serif",
  },

  layout: {
    useDiagonalDividers: true,
    heroFullBleed: true,
  },
};

export default gymTheme;
