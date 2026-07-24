import type { BusinessPreset } from "@/types/preset";

/**
 * Gym / Fitness Center Preset
 *
 * Sample content for demo purposes only.
 * All testimonials are clearly placeholder text.
 */
const gym: BusinessPreset = {
  id: "gym",
  industryLabel: "Fitness Center",
  businessName: "IronVault Fitness",
  tagline: "Transform your body. Strengthen your mind. Join a community that pushes you further.",
  primaryColor: "#EF4444",
  heroImage: "/images/demo/gym-hero.jpg",
  services: [
    {
      title: "Personal Training",
      description:
        "One-on-one coaching with certified trainers who design custom programs around your goals.",
      icon: "User",
    },
    {
      title: "Group Classes",
      description:
        "High-energy yoga, HIIT, spin, and boxing classes led by motivating instructors.",
      icon: "Users",
    },
    {
      title: "Strength & Conditioning",
      description:
        "State-of-the-art free weights, machines, and functional training zones for all levels.",
      icon: "Dumbbell",
    },
    {
      title: "Nutrition Coaching",
      description:
        "Personalized meal plans and dietary guidance to complement your training regimen.",
      icon: "Apple",
    },
    {
      title: "Recovery Suite",
      description:
        "Sauna, steam room, stretch zones, and massage therapy to optimize recovery.",
      icon: "Heart",
    },
  ],
  testimonials: [
    {
      quote:
        "Dropped 25 lbs in 3 months thanks to the personal training program. The coaches genuinely care about your progress.",
      author: "M. Ali",
      role: "Member since 2024",
    },
    {
      quote:
        "The 6 AM HIIT classes completely changed my energy levels. Best decision I ever made for my health.",
      author: "R. Patel",
      role: "Early Bird Member",
    },
    {
      quote:
        "Clean, well-maintained equipment and a welcoming atmosphere. No gym intimidation here.",
      author: "T. Chen",
      role: "Regular Member",
    },
  ],
  pricing: [
    {
      tier: "Starter",
      price: "$29",
      features: [
        "Unlimited gym access (6 AM – 10 PM)",
        "Standard equipment access",
        "Locker room & showers",
        "One free fitness assessment",
        "Mobile app access",
      ],
    },
    {
      tier: "Pro",
      price: "$59",
      features: [
        "24/7 gym access",
        "Unlimited group classes",
        "Personal trainer (2 sessions/month)",
        "Nutrition starter plan",
        "Guest passes (2/month)",
      ],
    },
    {
      tier: "Elite",
      price: "$99",
      features: [
        "Everything in Pro",
        "Unlimited personal training",
        "Full recovery suite access",
        "Custom meal planning",
        "Priority class booking",
      ],
    },
  ],
  phone: "+1 (555) 987-6543",
  whatsapp: "+15559876543",
  ctaLabel: "Start Your Free Trial",
  isSampleContent: true,
};

export default gym;
