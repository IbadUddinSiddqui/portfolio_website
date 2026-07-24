import type { BusinessPreset } from "@/types/preset";

/**
 * Restaurant Preset
 *
 * Sample content for demo purposes only.
 * All testimonials are clearly placeholder text.
 */
const restaurant: BusinessPreset = {
  id: "restaurant",
  industryLabel: "Restaurant",
  businessName: "The Golden Ladle",
  tagline: "Authentic flavours, locally sourced — a dining experience crafted with passion",
  primaryColor: "#F59E0B",
  heroImage: "/images/demo/restaurant-hero.jpg",
  services: [
    {
      title: "Dine-In Experience",
      description:
        "Warm, inviting atmosphere with seasonal menus featuring locally sourced ingredients.",
      icon: "UtensilsCrossed",
    },
    {
      title: "Private Events",
      description:
        "Host your special occasions in our private dining room — birthdays, anniversaries, and corporate gatherings.",
      icon: "PartyPopper",
    },
    {
      title: "Takeaway & Delivery",
      description:
        "Enjoy our full menu from the comfort of your home with contactless delivery and easy online ordering.",
      icon: "Package",
    },
    {
      title: "Catering Services",
      description:
        "Full-service catering for events of any size — from intimate dinners to large celebrations.",
      icon: "ChefHat",
    },
  ],
  testimonials: [
    {
      quote:
        "The grilled salmon was perfect. You can taste the freshness in every dish. Easily our new favourite spot.",
      author: "L. Pereira",
      role: "Regular Diner",
    },
    {
      quote:
        "We booked the private room for our anniversary. Impeccable service, incredible food, unforgettable evening.",
      author: "N. & K. James",
      role: "Anniversary Guests",
    },
    {
      quote:
        "As a chef myself, I'm picky about ingredients. The Golden Ladle sources quality produce and it shows.",
      author: "D. Martinez",
      role: "Local Chef",
    },
  ],
  pricing: [
    {
      tier: "Lunch",
      price: "$$",
      features: [
        "Starter + main course",
        "Complimentary bread basket",
        "Soft drink or iced tea",
        "Weekday availability",
        "Reservation recommended",
      ],
    },
    {
      tier: "Dinner",
      price: "$$$",
      features: [
        "Three-course curated menu",
        "Wine pairing option",
        "Amuse-bouche on the house",
        "Live music on weekends",
        "Priority seating",
      ],
    },
    {
      tier: "Chef's Table",
      price: "$$$$",
      features: [
        "Exclusive 7-course tasting menu",
        "Private chef interaction",
        "Premium wine flight",
        "Personalized menu booklet",
        "Dedicated sommelier",
      ],
    },
  ],
  phone: "+1 (555) 456-7890",
  whatsapp: "+15554567890",
  ctaLabel: "Reserve a Table",
  isSampleContent: true,
};

export default restaurant;
