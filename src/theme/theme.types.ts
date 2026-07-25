/**
 * IndustryTheme
 *
 * Defines the full design system for each industry preset used in the /demo route.
 * Each theme includes scoped CSS variable overrides, font families, and layout flags.
 */
export interface IndustryTheme {
  /** Unique id matching the preset id, e.g. "dental" */
  id: string;

  /** Display name, e.g. "Dental Clinic" */
  name: string;

  /**
   * CSS custom properties to scope onto the demo preview container.
   * Key = variable name with leading `--` (e.g. `"--background"`)
   * Value = the CSS value (e.g. `"#F8FAFC"`)
   */
  cssVariables: Record<string, string>;

  /** Font-family stacks for headings and body text */
  fontStacks: {
    heading: string;
    body: string;
  };

  /** Layout / rendering flags */
  layout: {
    /** Use diagonal section dividers instead of straight lines (gym) */
    useDiagonalDividers?: boolean;
    /** Hero uses full-bleed image/video (gym, restaurant) */
    heroFullBleed?: boolean;
  };
}

/**
 * Registry of all available themes, keyed by theme id.
 */
export type ThemeRegistry = Record<string, IndustryTheme>;
