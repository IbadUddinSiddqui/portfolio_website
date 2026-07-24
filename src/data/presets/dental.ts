import type { BusinessPreset } from "@/types/preset";

/**
 * Dental Clinic Preset
 *
 * Sample content for demo purposes only.
 * All testimonials are clearly placeholder text.
 */
const dental: BusinessPreset = {
  id: "dental",
  industryLabel: "Dental Clinic",
  businessName: "BrightSmile Dental Care",
  tagline: "Your comfort is our priority — modern dentistry with a gentle touch",
  primaryColor: "#0EA5E9",
  heroImage: "/images/demo/dental-hero.jpg",
  services: [
    {
      title: "General Dentistry",
      description:
        "Comprehensive check-ups, cleanings, and preventive care to keep your smile healthy and bright.",
      icon: "Tooth",
    },
    {
      title: "Cosmetic Dentistry",
      description:
        "Teeth whitening, veneers, and smile makeovers tailored to your unique facial structure.",
      icon: "Sparkles",
    },
    {
      title: "Orthodontics",
      description:
        "Traditional braces and clear aligners for patients of all ages — straighten your smile with confidence.",
      icon: "ArrowLeftRight",
    },
    {
      title: "Emergency Care",
      description:
        "Same-day appointments for dental emergencies including toothaches, fractures, and infections.",
      icon: "Ambulance",
    },
    {
      title: "Pediatric Dentistry",
      description:
        "Gentle, child-friendly dental care designed to make young patients feel safe and comfortable.",
      icon: "Baby",
    },
  ],
  testimonials: [
    {
      quote:
        "I hadn't been to the dentist in years and was nervous. The team made me feel completely at ease. Highly recommend!",
      author: "S. Khan",
      role: "Local Patient",
    },
    {
      quote:
        "The teeth whitening results exceeded my expectations. Professional, clean, and genuinely caring staff.",
      author: "A. Ahmed",
      role: "Regular Patient",
    },
    {
      quote:
        "My kids actually look forward to their dental visits now. The pediatric care here is outstanding.",
      author: "F. Hassan",
      role: "Parent of Two",
    },
  ],
  pricing: [
    {
      tier: "Basic",
      price: "$49",
      features: [
        "Comprehensive oral exam",
        "Professional cleaning",
        "X-rays (if needed)",
        "Oral hygiene consultation",
        "Follow-up care plan",
      ],
    },
    {
      tier: "Premium",
      price: "$149",
      features: [
        "Everything in Basic",
        "Teeth whitening session",
        "Fluoride treatment",
        "Sealants application",
        "Priority scheduling",
      ],
    },
    {
      tier: "Family",
      price: "$299",
      features: [
        "Coverage for up to 4 family members",
        "All Basic & Premium services",
        "Pediatric dental care",
        "24/7 emergency support",
        "Bi-annual check-ups included",
      ],
    },
  ],
  phone: "+1 (555) 123-4567",
  whatsapp: "+15551234567",
  ctaLabel: "Book a Free Consultation",
  isSampleContent: true,
};

export default dental;
