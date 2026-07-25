import type { BusinessPreset } from "@/types/preset";

/**
 * Gym / Fitness Center Preset — "Nova Fitness"
 *
 * Sample content for demo purposes only.
 * All testimonials are clearly placeholder text.
 *
 * Section order (per design brief):
 *   Hero (full-bleed action image) → Stats strip → Programs/Classes grid →
 *   Membership Plans (monthly tiers) → Meet the Trainers →
 *   Transformation Gallery → Facility Tour → Testimonials (results-focused) →
 *   Class Schedule (timetable) → Final CTA (urgency-driven)
 */
const gym: BusinessPreset = {
  id: "gym",
  themeId: "gym",
  industryLabel: "Fitness Center",
  businessName: "Nova Fitness",
  tagline: "Transform your body. Strengthen your mind. Join a community that pushes you further.",
  primaryColor: "#A3E635",
  heroImage: "/images/demo/gym-hero.jpg",
  phone: "+1 (555) 987-6543",
  whatsapp: "+15559876543",
  ctaLabel: "Claim Your Free Week",
  secondaryCtaLabel: "Join Now",
  isSampleContent: true,

  trustStats: [
    { value: "10+", label: "Years Running", icon: "Calendar" },
    { value: "3,500+", label: "Active Members", icon: "Users" },
    { value: "85%", label: "Avg. Retention", icon: "Heart" },
    { value: "50+", label: "Weekly Classes", icon: "Zap" },
  ],

  programs: [
    {
      title: "HIIT Circuit",
      description: "High-intensity interval training combining bodyweight and equipment work. Maximum results in 30 minutes.",
      icon: "Zap",
      intensity: "High",
      duration: "30 min",
    },
    {
      title: "Strength Foundations",
      description: "Learn proper lifting technique with barbell, dumbbell, and machine training. Perfect for beginners.",
      icon: "Dumbbell",
      intensity: "Moderate",
      duration: "45 min",
    },
    {
      title: "Power Yoga",
      description: "Dynamic flow-based yoga that builds flexibility, core strength, and mental focus.",
      icon: "Heart",
      intensity: "Moderate",
      duration: "50 min",
    },
    {
      title: "Boxing Fitness",
      description: "Full-body boxing workout with bag work, footwork drills, and conditioning. No partner needed.",
      icon: "Zap",
      intensity: "High",
      duration: "45 min",
    },
    {
      title: "Spin & Sculpt",
      description: "High-energy indoor cycling mixed with floor exercises for a total-body burn.",
      icon: "Heart",
      intensity: "High",
      duration: "45 min",
    },
    {
      title: "Mobility & Recovery",
      description: "Improve range of motion, reduce injury risk, and speed up recovery with guided mobility work.",
      icon: "Heart",
      intensity: "Low",
      duration: "30 min",
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
        "1-on-1 trainer (2 sessions/month)",
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

  team: [
    {
      name: "Marcus Rivera",
      role: "Head Coach · CSCS",
      bio: "10 years coaching athletes from beginners to competitors. Specializes in strength & conditioning.",
    },
    {
      name: "Aisha Patel",
      role: "HIIT & Boxing Coach",
      bio: "Former competitive boxer turned coach. Her HIIT classes are legendary for results.",
    },
    {
      name: "Jordan Hayes",
      role: "Yoga & Mobility Lead",
      bio: "Certified yoga instructor (RYT-500) with a focus on functional mobility and breathwork.",
    },
    {
      name: "David Okonkwo",
      role: "Nutrition Coach",
      bio: "Registered dietitian who builds practical meal plans that fit real lifestyles.",
    },
  ],

  gallery: [
    {
      name: "Sarah K.",
      achievement: "Lost 42 lbs in 6 months",
      category: "Transformation",
    },
    {
      name: "Mike T.",
      achievement: "Deadlift 405 lbs — 12-month journey",
      category: "Strength",
    },
    {
      name: "Priya R.",
      achievement: "Completed first marathon at 45",
      category: "Endurance",
    },
    {
      name: "Alex M.",
      achievement: "25% body fat → 12% in 8 months",
      category: "Transformation",
    },
    {
      name: "Carlos G.",
      achievement: "Rehabbed back injury, now coaching others",
      category: "Recovery",
    },
    {
      name: "Emma L.",
      achievement: "First pull-up at 52 — now doing 10",
      category: "Strength",
    },
  ],

  facility: [
    {
      title: "Free Weight Zone",
      description: "8 power racks, 3,000+ lbs of plates, dumbbells up to 150 lbs, and dedicated deadlift platforms.",
      icon: "Dumbbell",
    },
    {
      title: "Cardio Theatre",
      description: "40 cardio machines with personal screens, streaming, and heart rate zone tracking.",
      icon: "Heart",
    },
    {
      title: "Recovery Suite",
      description: "Sauna, steam room, cold plunge, compression therapy, and stretch pods.",
      icon: "Heart",
    },
    {
      title: "Turf Zone",
      description: "40x30 ft artificial turf for sled pushes, agility drills, battle ropes, and functional training.",
      icon: "Zap",
    },
    {
      title: "Studio Rooms",
      description: "Three sound-equipped studios for yoga, spin, boxing, and HIIT. Floor-to-ceiling mirrors.",
      icon: "Heart",
    },
    {
      title: "Fuel Bar",
      description: "Post-workout protein shakes, cold-pressed juices, healthy meals, and supplements.",
      icon: "Heart",
    },
  ],

  classSchedule: [
    {
      day: "Monday",
      classes: [
        { time: "6:00 AM", name: "HIIT Circuit", trainer: "Aisha", level: "All Levels" },
        { time: "7:00 AM", name: "Power Yoga", trainer: "Jordan", level: "All Levels" },
        { time: "9:00 AM", name: "Strength Foundations", trainer: "Marcus", level: "Beginner" },
        { time: "12:00 PM", name: "Boxing Fitness", trainer: "Aisha", level: "Intermediate" },
        { time: "5:30 PM", name: "Spin & Sculpt", trainer: "Mike", level: "All Levels" },
        { time: "7:00 PM", name: "Mobility & Recovery", trainer: "Jordan", level: "All Levels" },
      ],
    },
    {
      day: "Tuesday",
      classes: [
        { time: "6:00 AM", name: "Strength Foundations", trainer: "Marcus", level: "Beginner" },
        { time: "7:30 AM", name: "HIIT Circuit", trainer: "Aisha", level: "All Levels" },
        { time: "9:00 AM", name: "Power Yoga", trainer: "Jordan", level: "All Levels" },
        { time: "12:00 PM", name: "Spin & Sculpt", trainer: "Mike", level: "All Levels" },
        { time: "4:30 PM", name: "Boxing Fitness", trainer: "Aisha", level: "Intermediate" },
        { time: "6:00 PM", name: "Mobility & Recovery", trainer: "Jordan", level: "All Levels" },
      ],
    },
    {
      day: "Wednesday",
      classes: [
        { time: "6:00 AM", name: "Spin & Sculpt", trainer: "Mike", level: "All Levels" },
        { time: "7:30 AM", name: "Strength Foundations", trainer: "Marcus", level: "Beginner" },
        { time: "9:00 AM", name: "HIIT Circuit", trainer: "Aisha", level: "All Levels" },
        { time: "12:00 PM", name: "Power Yoga", trainer: "Jordan", level: "All Levels" },
        { time: "5:30 PM", name: "Boxing Fitness", trainer: "Aisha", level: "Intermediate" },
        { time: "7:00 PM", name: "Mobility & Recovery", trainer: "Jordan", level: "All Levels" },
      ],
    },
    {
      day: "Thursday",
      classes: [
        { time: "6:00 AM", name: "Boxing Fitness", trainer: "Aisha", level: "Intermediate" },
        { time: "7:30 AM", name: "Power Yoga", trainer: "Jordan", level: "All Levels" },
        { time: "9:00 AM", name: "HIIT Circuit", trainer: "Aisha", level: "All Levels" },
        { time: "12:00 PM", name: "Spin & Sculpt", trainer: "Mike", level: "All Levels" },
        { time: "4:30 PM", name: "Strength Foundations", trainer: "Marcus", level: "Beginner" },
        { time: "6:00 PM", name: "Mobility & Recovery", trainer: "Jordan", level: "All Levels" },
      ],
    },
    {
      day: "Friday",
      classes: [
        { time: "6:00 AM", name: "HIIT Circuit", trainer: "Aisha", level: "All Levels" },
        { time: "7:30 AM", name: "Spin & Sculpt", trainer: "Mike", level: "All Levels" },
        { time: "9:00 AM", name: "Power Yoga", trainer: "Jordan", level: "All Levels" },
        { time: "12:00 PM", name: "Strength Foundations", trainer: "Marcus", level: "Beginner" },
        { time: "5:00 PM", name: "Boxing Fitness", trainer: "Aisha", level: "All Levels" },
      ],
    },
    {
      day: "Saturday",
      classes: [
        { time: "8:00 AM", name: "HIIT Circuit", trainer: "Aisha", level: "All Levels" },
        { time: "9:30 AM", name: "Power Yoga", trainer: "Jordan", level: "All Levels" },
        { time: "11:00 AM", name: "Spin & Sculpt", trainer: "Mike", level: "All Levels" },
      ],
    },
    {
      day: "Sunday",
      classes: [
        { time: "9:00 AM", name: "Mobility & Recovery", trainer: "Jordan", level: "All Levels" },
        { time: "10:30 AM", name: "Strength Foundations", trainer: "Marcus", level: "Beginner" },
      ],
    },
  ],

  testimonials: [
    {
      quote:
        "Dropped 25 lbs in 3 months thanks to the personal training program. The coaches genuinely care about your progress.",
      author: "Mike A.",
      role: "Member since 2024",
      rating: 5,
    },
    {
      quote:
        "The 6 AM HIIT classes completely changed my energy levels. Best decision I ever made for my health.",
      author: "Rita P.",
      role: "Early Bird Member",
      rating: 5,
    },
    {
      quote:
        "Clean, well-maintained equipment and a community that actually pushes you. No intimidation, just results.",
      author: "Tom C.",
      role: "Regular Member",
      rating: 5,
    },
  ],
};

export default gym;
