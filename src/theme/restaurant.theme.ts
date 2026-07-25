import type { IndustryTheme } from "./theme.types";

/**
 * Restaurant — "Locale Kitchen"
 *
 * Emotional goal: appetite appeal, ambiance, experience.
 * Warm cream background (#FFF8F0), deep terracotta primary (#7C2D12),
 * muted gold accent (#D4A574), warm brown-black text (#292524).
 * Headings: Playfair Display (elegant serif). Body: Lato.
 */
const restaurantTheme: IndustryTheme = {
  id: "restaurant",
  name: "Restaurant",

  cssVariables: {
    /* ─── Background / Surface ─────────────────────── */
    "--background": "#FFF8F0",
    "--background-secondary": "#FFEDD5",
    "--background-elevated": "#FFFFFF",
    "--background-hover": "#FED7AA",
    "--foreground": "#292524",
    "--card": "#FFFFFF",
    "--card-foreground": "#292524",
    "--card-background": "#FFFFFF",
    "--card-border": "#E7E5E4",
    "--popover": "#FFFFFF",
    "--popover-foreground": "#292524",

    /* ─── Surface Tokens ───────────────────────────── */
    "--surface": "#FFFFFF",
    "--surface-secondary": "#FFEDD5",
    "--surface-glass": "rgba(255,255,255,0.8)",

    /* ─── Brand Accents ────────────────────────────── */
    "--primary": "#7C2D12",
    "--primary-foreground": "#FFFFFF",
    "--secondary": "#92400E",
    "--secondary-foreground": "#FFFFFF",
    "--accent": "#D4A574",
    "--accent-foreground": "#292524",
    "--muted": "#FED7AA",
    "--muted-foreground": "#78716C",

    /* ─── Link / CTA ───────────────────────────────── */
    "--cta": "#7C2D12",
    "--cta-foreground": "#FFFFFF",
    "--cta-hover": "#92400E",
    "--link": "#7C2D12",
    "--link-hover": "#92400E",

    /* ─── Button Tokens ────────────────────────────── */
    "--button-primary": "#7C2D12",
    "--button-primary-hover": "#92400E",
    "--button-primary-foreground": "#FFFFFF",
    "--button-secondary": "transparent",
    "--button-secondary-hover": "rgba(124,45,18,0.08)",
    "--button-secondary-foreground": "#292524",

    /* ─── Status ───────────────────────────────────── */
    "--success": "#65A30D",
    "--warning": "#D4A574",
    "--error": "#DC2626",
    "--info": "#7C2D12",

    /* ─── Borders / Inputs / Rings ─────────────────── */
    "--border": "#E7E5E4",
    "--border-light": "rgba(0,0,0,0.06)",
    "--border-focus": "#7C2D12",
    "--input": "#D6D3D1",
    "--input-background": "#FFFFFF",
    "--input-border": "#D6D3D1",
    "--input-focus": "#7C2D12",
    "--ring": "#7C2D12",

    /* ─── Navbar ───────────────────────────────────── */
    "--navbar-background": "rgba(255,248,240,0.9)",
    "--navbar-border": "rgba(212,165,116,0.2)",
    "--navbar-active": "#7C2D12",

    /* ─── Hero ─────────────────────────────────────── */
    "--hero-bg": "#FFF8F0",
    "--hero-glow": "rgba(124,45,18,0.1)",
    "--hero-highlight": "#7C2D12",
    "--hero-gradient": "linear-gradient(135deg, #7C2D12, #D4A574)",

    /* ─── Badge ────────────────────────────────────── */
    "--badge-primary": "#7C2D12",
    "--badge-primary-foreground": "#FFFFFF",
    "--badge-secondary": "#D4A574",
    "--badge-secondary-foreground": "#292524",
    "--badge-destructive": "#7F1D1D",
    "--badge-destructive-foreground": "#FFFFFF",

    /* ─── Glass/Misc ──────────────────────────────── */
    "--glass": "rgba(255,255,255,0.6)",

    /* ─── Text Tones ──────────────────────────────── */
    "--text-primary": "#292524",
    "--text-secondary": "#78716C",
    "--text-muted": "#A8A29E",
    "--text-disabled": "#D6D3D1",
  },

  fontStacks: {
    heading: "var(--font-playfair-display), 'Playfair Display', serif",
    body: "var(--font-lato), 'Lato', system-ui, sans-serif",
  },

  layout: {
    useDiagonalDividers: false,
    heroFullBleed: true,
  },
};

export default restaurantTheme;
