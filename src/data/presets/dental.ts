import type { BusinessPreset } from "@/types/preset";

/**
 * Dental Clinic Preset — "BrightSmile Dental Care"
 *
 * Sample content for demo purposes only.
 * All testimonials are clearly placeholder text.
 *
 * Section order (per design brief):
 *   Hero → Trust strip → Services (icon cards with starting prices) →
 *   Why Choose Us → Meet the Team → Testimonials (star ratings) →
 *   Insurance/Payment strip → FAQ accordion → Location/Hours/Map →
 *   Final CTA banner
 */
const dental: BusinessPreset = {
  id: "dental",
  themeId: "dental",
  industryLabel: "Dental Clinic",
  businessName: "BrightSmile Dental Care",
  tagline: "Your comfort is our priority — modern dentistry with a gentle touch",
  primaryColor: "#0EA5E9",
  heroImage: "/images/demo/dental-hero.jpg",
  phone: "+1 (555) 123-4567",
  whatsapp: "+15551234567",
  ctaLabel: "Book a Free Consultation",
  secondaryCtaLabel: "Call to Book",
  isSampleContent: true,

  services: [
    {
      title: "General Dentistry",
      description:
        "Comprehensive check-ups, professional cleanings, and preventive care to keep your smile healthy and bright.",
      icon: "Tooth",
      startingPrice: "$49",
    },
    {
      title: "Cosmetic Dentistry",
      description:
        "Teeth whitening, premium veneers, and complete smile makeovers tailored to your unique facial structure.",
      icon: "Sparkles",
      startingPrice: "$149",
    },
    {
      title: "Orthodontics",
      description:
        "Traditional braces, clear aligners (Invisalign), and retainers for patients of all ages.",
      icon: "ArrowLeftRight",
      startingPrice: "$199",
    },
    {
      title: "Emergency Care",
      description:
        "Same-day emergency appointments for toothaches, fractures, infections, and knocked-out teeth.",
      icon: "Ambulance",
      startingPrice: "$89",
    },
    {
      title: "Pediatric Dentistry",
      description:
        "Gentle, child-friendly care designed to make young patients feel safe and build lifelong healthy habits.",
      icon: "Baby",
      startingPrice: "$39",
    },
  ],

  testimonials: [
    {
      quote:
        "I hadn't been to the dentist in years and was nervous. The team made me feel completely at ease from the moment I walked in. Highly recommend!",
      author: "Sarah K.",
      role: "New Patient",
      rating: 5,
    },
    {
      quote:
        "The teeth whitening results exceeded my expectations. Professional, clean, and genuinely caring staff. My smile has never looked better.",
      author: "Ahmed R.",
      role: "Regular Patient",
      rating: 5,
    },
    {
      quote:
        "My kids actually look forward to their dental visits now. Dr. Lee is amazing with children — patient, kind, and so reassuring.",
      author: "Fatima H.",
      role: "Parent of Two",
      rating: 5,
    },
  ],

  trustStats: [
    { value: "15+", label: "Years Experience", icon: "Calendar" },
    { value: "12,000+", label: "Patients Served", icon: "Users" },
    { value: "5-Star", label: "Patient Rating", icon: "Star" },
    { value: "A+", label: "BBB Rating", icon: "Award" },
  ],

  whyChooseUs: [
    {
      title: "Gentle, Pain-Free Dentistry",
      description:
        "We use the latest anaesthetic techniques and sedation options so your visit is completely comfortable — no anxiety, no pain.",
      icon: "Heart",
    },
    {
      title: "Modern Technology",
      description:
        "Digital X-rays, intraoral scanners, and laser dentistry mean faster, more precise treatments with less discomfort.",
      icon: "Sparkles",
    },
    {
      title: "Flexible Scheduling",
      description:
        "Early morning, evening, and Saturday appointments available. We work around your busy schedule.",
      icon: "Calendar",
    },
    {
      title: "Transparent Pricing",
      description:
        "No hidden fees. We provide upfront treatment plans with clear costs and work with all major insurance providers.",
      icon: "DollarSign",
    },
  ],

  team: [
    {
      name: "Dr. Emily Chen",
      role: "Lead Dentist · DDS",
      bio: "15+ years of experience in general and cosmetic dentistry. Trained at UCLA School of Dentistry.",
      image: undefined,
    },
    {
      name: "Dr. James Okonkwo",
      role: "Orthodontist · DDS, MS",
      bio: "Specialist in braces and clear aligners. Certified Invisalign provider with 400+ successful cases.",
      image: undefined,
    },
    {
      name: "Lisa Park",
      role: "Dental Hygienist",
      bio: "Gentle and thorough — Lisa makes even the most nervous patients feel at ease during cleanings.",
      image: undefined,
    },
    {
      name: "Marcus Rivera",
      role: "Patient Coordinator",
      bio: "The friendly face at the front desk. Marcus handles scheduling, insurance, and any questions you have.",
      image: undefined,
    },
  ],

  insurance: {
    providers: [
      "Delta Dental",
      "Cigna",
      "Aetna",
      "MetLife",
      "BlueCross BlueShield",
      "United Concordia",
    ],
    paymentOptions: [
      "Visa / Mastercard / Amex",
      "CareCredit financing",
      "In-house payment plans",
      "FSA / HSA accepted",
    ],
    note: "We file claims directly with all major providers. If you don't see yours, call us — we may still accept it.",
  },

  faq: [
    {
      question: "How often should I visit the dentist?",
      answer:
        "We recommend a check-up and professional cleaning every six months. Regular visits help catch issues early and keep your smile healthy. Patients with certain conditions may need more frequent visits.",
    },
    {
      question: "Does dental work hurt?",
      answer:
        "Not with us. We use modern anaesthetic techniques, topical numbing gels, and offer sedation options for anxious patients. Most procedures are virtually pain-free. You'll be amazed at how comfortable modern dentistry can be.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, CareCredit financing, in-house payment plans, and FSA/HSA accounts. We work directly with Delta Dental, Cigna, Aetna, MetLife, and other major insurance providers to maximize your benefits.",
    },
    {
      question: "Do you treat children?",
      answer:
        "Absolutely! Our pediatric dentistry team specializes in making kids feel safe and comfortable. We recommend a child's first visit by age 1 or within 6 months of their first tooth coming in.",
    },
    {
      question: "What if I have a dental emergency?",
      answer:
        "We reserve same-day emergency slots every day. Call us immediately at +1 (555) 123-4567 and we'll get you in as soon as possible. For after-hours emergencies, our answering service connects you with a dentist on call.",
    },
  ],

  location: {
    address: "1243 Wellness Avenue, Suite 200, Springfield, IL 62701",
    hours: [
      { day: "Monday – Thursday", hours: "8:00 AM – 6:00 PM" },
      { day: "Friday", hours: "8:00 AM – 4:00 PM" },
      { day: "Saturday", hours: "9:00 AM – 1:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    mapUrl: "https://maps.google.com/?q=1243+Wellness+Avenue+Springfield+IL",
    phone: "+1 (555) 123-4567",
  },
};

export default dental;
