/**
 * BusinessPreset
 *
 * Describes every industry website preset used in the /demo route.
 * All data is explicitly sample/placeholder — never mistaken for real client data.
 */
export interface BusinessPreset {
  /** Unique identifier, e.g. "dental", "gym", "restaurant" */
  id: string;

  /** Human-readable industry label, e.g. "Dental Clinic" */
  industryLabel: string;

  /** The sample business name shown in the preview */
  businessName: string;

  /** Short tagline under the business name */
  tagline: string;

  /** Hex colour that drives the accent override for this preset */
  primaryColor: string;

  /** URL or path to the hero image */
  heroImage: string;

  /** Service offerings (3–5 recommended) */
  services: { title: string; description: string; icon?: string }[];

  /** Client testimonials — clearly placeholder text */
  testimonials: { quote: string; author: string; role: string }[];

  /** Optional 3-tier pricing table */
  pricing?: { tier: string; price: string; features: string[] }[];

  /** Contact phone number (placeholder) */
  phone: string;

  /** WhatsApp number or link (placeholder) */
  whatsapp: string;

  /** Call-to-action button text */
  ctaLabel: string;

  /**
   * Flag that marks this content as demo/placeholder data.
   * Always `true` — ensures nothing here is ever mistaken for real client data.
   */
  isSampleContent: true;
}
