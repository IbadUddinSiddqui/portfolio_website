/**
 * BusinessPreset
 *
 * Describes every industry website preset used in the /demo route.
 * All data is explicitly sample/placeholder — never mistaken for real client data.
 */
export interface ServiceItem {
  title: string;
  description: string;
  icon?: string;
  startingPrice?: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  rating?: number;
}

export interface TrustStat {
  value: string;
  label: string;
  icon?: string;
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
  icon?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LocationInfo {
  address: string;
  hours: { day: string; hours: string }[];
  mapUrl?: string;
  phone: string;
}

export interface InsuranceInfo {
  providers: string[];
  paymentOptions: string[];
  note?: string;
}

/** Restaurant-specific types */
export interface MenuItem {
  name: string;
  description: string;
  price: string;
  category?: string;
  image?: string;
  dietary?: string[];
}

export interface StoryInfo {
  title: string;
  content: string;
  image?: string;
  quote?: string;
}

export interface GalleryImage {
  image?: string;
  title: string;
  category: "food" | "ambiance" | "interior";
}

export interface ReservationInfo {
  note?: string;
  phoneReservation?: boolean;
}

export interface EventInfo {
  title: string;
  description: string;
  image?: string;
  capacity?: string;
  features?: string[];
}

/** Gym-specific types */
export interface ProgramItem {
  title: string;
  description: string;
  icon?: string;
  intensity?: string;
  duration?: string;
}

export interface GalleryItem {
  image?: string;
  name: string;
  achievement: string;
  category?: string;
}

export interface FacilityItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ClassScheduleItem {
  day: string;
  classes: {
    time: string;
    name: string;
    trainer: string;
    level: string;
  }[];
}

/**
 * BusinessPreset
 *
 * Describes every industry website preset used in the /demo route.
 * All data is explicitly sample/placeholder — never mistaken for real client data.
 */
export interface BusinessPreset {
  /** Unique identifier, e.g. "dental", "gym", "restaurant" */
  id: string;

  /** Theme id to look up the matching IndustryTheme, e.g. "dental" */
  themeId: string;

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

  /** Service offerings (optional — gym uses programs) */
  services?: ServiceItem[];

  /** Client testimonials — clearly placeholder text */
  testimonials: TestimonialItem[];

  /** Optional 3-tier pricing table */
  pricing?: { tier: string; price: string; features: string[] }[];

  /** Industry-specific optional sections */
  trustStats?: TrustStat[];
  whyChooseUs?: WhyChooseUsItem[];
  team?: TeamMember[];
  insurance?: InsuranceInfo;
  faq?: FAQItem[];
  location?: LocationInfo;

  /** Restaurant-specific sections */
  story?: StoryInfo;
  menu?: MenuItem[];
  galleryImages?: GalleryImage[];
  reservationInfo?: ReservationInfo;
  events?: EventInfo[];

  /** Gym-specific sections */
  programs?: ProgramItem[];
  gallery?: GalleryItem[];
  facility?: FacilityItem[];
  classSchedule?: ClassScheduleItem[];

  /** Contact phone number (placeholder) */
  phone: string;

  /** WhatsApp number or link (placeholder) */
  whatsapp: string;

  /** Call-to-action button text */
  ctaLabel: string;

  /** Secondary CTA text (e.g. for sticky bar) */
  secondaryCtaLabel?: string;

  /**
   * Flag that marks this content as demo/placeholder data.
   * Always `true` — ensures nothing here is ever mistaken for real client data.
   */
  isSampleContent: true;
}
