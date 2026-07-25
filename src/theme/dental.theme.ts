import type { IndustryTheme } from "./theme.types";

/**
 * Dental Clinic — "BrightSmile Dental Care"
 *
 * Emotional goal: calm, trust, cleanliness.
 * Light background (#F8FAFC), sky/teal primary (#0EA5E9 / #2DD4BF),
 * warm coral accent (#FF6B6B), dark slate text (#1E293B).
 * Headings: Nunito (rounded, friendly). Body: Inter.
 */
const dentalTheme: IndustryTheme = {
  id: "dental",
  name: "Dental Clinic",

  cssVariables: {
    /* ─── Background / Surface ─────────────────────── */
    "--background": "#F8FAFC",
    "--background-secondary": "#F1F5F9",
    "--background-elevated": "#FFFFFF",
    "--background-hover": "#E2E8F0",
    "--foreground": "#1E293B",
    "--card": "#FFFFFF",
    "--card-foreground": "#1E293B",
    "--card-background": "#FFFFFF",
    "--card-border": "#E2E8F0",
    "--popover": "#FFFFFF",
    "--popover-foreground": "#1E293B",

    /* ─── Surface Tokens ───────────────────────────── */
    "--surface": "#FFFFFF",
    "--surface-secondary": "#F1F5F9",
    "--surface-glass": "rgba(255,255,255,0.8)",

    /* ─── Brand Accents ────────────────────────────── */
    "--primary": "#0EA5E9",
    "--primary-foreground": "#FFFFFF",
    "--secondary": "#2DD4BF",
    "--secondary-foreground": "#FFFFFF",
    "--accent": "#FF6B6B",
    "--accent-foreground": "#FFFFFF",
    "--muted": "#E2E8F0",
    "--muted-foreground": "#64748B",

    /* ─── Link / CTA ───────────────────────────────── */
    "--cta": "#FF6B6B",
    "--cta-foreground": "#FFFFFF",
    "--cta-hover": "#FF8A8A",
    "--link": "#0EA5E9",
    "--link-hover": "#0284C7",

    /* ─── Button Tokens ────────────────────────────── */
    "--button-primary": "#0EA5E9",
    "--button-primary-hover": "#0284C7",
    "--button-primary-foreground": "#FFFFFF",
    "--button-secondary": "transparent",
    "--button-secondary-hover": "rgba(14,165,233,0.08)",
    "--button-secondary-foreground": "#1E293B",

    /* ─── Status ───────────────────────────────────── */
    "--success": "#10B981",
    "--warning": "#F59E0B",
    "--error": "#EF4444",
    "--info": "#0EA5E9",

    /* ─── Borders / Inputs / Rings ─────────────────── */
    "--border": "#E2E8F0",
    "--border-light": "rgba(0,0,0,0.06)",
    "--border-focus": "#0EA5E9",
    "--input": "#CBD5E1",
    "--input-background": "#FFFFFF",
    "--input-border": "#CBD5E1",
    "--input-focus": "#0EA5E9",
    "--ring": "#0EA5E9",

    /* ─── Navbar ───────────────────────────────────── */
    "--navbar-background": "rgba(248,250,252,0.9)",
    "--navbar-border": "rgba(14,165,233,0.15)",
    "--navbar-active": "#0EA5E9",

    /* ─── Hero ─────────────────────────────────────── */
    "--hero-bg": "#F8FAFC",
    "--hero-glow": "rgba(14,165,233,0.12)",
    "--hero-highlight": "#0EA5E9",
    "--hero-gradient": "linear-gradient(135deg, #0EA5E9, #2DD4BF)",

    /* ─── Badge ────────────────────────────────────── */
    "--badge-primary": "#0EA5E9",
    "--badge-primary-foreground": "#FFFFFF",
    "--badge-secondary": "#2DD4BF",
    "--badge-secondary-foreground": "#FFFFFF",
    "--badge-destructive": "#7F1D1D",
    "--badge-destructive-foreground": "#FFFFFF",

    /* ─── Glass/Misc ──────────────────────────────── */
    "--glass": "rgba(255,255,255,0.6)",

    /* ─── Text Tones ──────────────────────────────── */
    "--text-primary": "#1E293B",
    "--text-secondary": "#64748B",
    "--text-muted": "#94A3B8",
    "--text-disabled": "#CBD5E1",
  },

  fontStacks: {
    heading: "var(--font-nunito), 'Nunito', system-ui, sans-serif",
    body: "var(--font-inter), 'Inter', system-ui, sans-serif",
  },

  layout: {
    useDiagonalDividers: false,
    heroFullBleed: false,
  },
};

export default dentalTheme;
