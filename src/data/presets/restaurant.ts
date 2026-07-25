import type { BusinessPreset } from "@/types/preset";

/**
 * Restaurant Preset — "Locale Kitchen"
 *
 * Sample content for demo purposes only.
 * All testimonials are clearly placeholder text.
 */
const restaurant: BusinessPreset = {
  id: "restaurant",
  themeId: "restaurant",
  industryLabel: "Restaurant",
  businessName: "Locale Kitchen",
  tagline: "Seasonal, locally sourced — every plate tells a story",
  primaryColor: "#7C2D12",
  heroImage: "/images/demo/restaurant-hero.jpg",

  /* ─── Chef / Restaurant Story ──────────────────── */
  story: {
    title: "Our Story",
    content:
      "Locale Kitchen was born from a simple belief: the best meals start with the best ingredients. Chef Maria Alvarez left her Michelin-starred kitchen in 2018 to return to her roots, building a restaurant that celebrates the farmers, foragers, and artisans within a 50-mile radius. Every dish on our menu changes with the seasons — not because it's trendy, but because that's when ingredients taste their best.",
    quote:
      "We don't just cook food. We tell the story of the land it came from.",
    image: "/images/demo/restaurant-story.jpg",
  },

  /* ─── Menu Highlights (6 dishes) ───────────────── */
  menu: [
    {
      name: "Wood-Fired Beetroot",
      description:
        "Smoked beetroot, whipped goat's curd, candied walnuts, sorrel",
      price: "$18",
      category: "Starters",
      dietary: ["Vegetarian", "Gluten-Free"],
    },
    {
      name: "Seared Scallops",
      description:
        "Diver scallops, cauliflower purée, brown butter, caper relish",
      price: "$24",
      category: "Starters",
    },
    {
      name: "Herb-Crusted Lamb Rack",
      description:
        "New Zealand lamb, rosemary crust, roasted heirloom carrots, red wine jus",
      price: "$42",
      category: "Mains",
    },
    {
      name: "Pan-Roasted Barramundi",
      description:
        "Crispy skin barramundi, fennel confit, citrus beurre blanc, micro greens",
      price: "$36",
      category: "Mains",
      dietary: ["Gluten-Free"],
    },
    {
      name: "Truffle Mushroom Risotto",
      description:
        "Arborio rice, wild mushrooms, black truffle, aged parmesan, parsley oil",
      price: "$28",
      category: "Mains",
      dietary: ["Vegetarian"],
    },
    {
      name: "Dark Chocolate Tart",
      description:
        "Valrhona chocolate, salted caramel, crème fraîche, gold leaf",
      price: "$16",
      category: "Desserts",
      dietary: ["Vegetarian"],
    },
  ],

  /* ─── Gallery (food + ambiance mix) ────────────── */
  galleryImages: [
    { title: "Seared Scallops", category: "food", image: "/images/demo/restaurant-gallery-1.jpg" },
    { title: "Herb-Crusted Lamb", category: "food", image: "/images/demo/restaurant-gallery-2.jpg" },
    { title: "Dining Room Ambiance", category: "ambiance", image: "/images/demo/restaurant-gallery-3.jpg" },
    { title: "Dark Chocolate Tart", category: "food", image: "/images/demo/restaurant-gallery-4.jpg" },
    { title: "Wine Cellar", category: "interior", image: "/images/demo/restaurant-gallery-5.jpg" },
    { title: "Chef's Counter", category: "ambiance", image: "/images/demo/restaurant-gallery-6.jpg" },
  ],

  /* ─── Reservations ─────────────────────────────── */
  reservationInfo: {
    note: "We reserve a portion of tables for walk-ins every evening. For parties of 6 or more, please call us directly.",
    phoneReservation: true,
  },

  /* ─── Events / Private Dining ──────────────────── */
  events: [
    {
      title: "The Chef's Table",
      description:
        "An intimate 8-seat experience at the kitchen counter. Watch Chef Alvarez and her team plate each course while enjoying a curated 7-course tasting menu with wine pairings.",
      capacity: "Up to 8 guests",
      features: [
        "7-course tasting menu",
        "Sommelier-curated wine pairing",
        "Interactive chef dialogue",
        "Personalized menu booklet",
        "Optional kitchen tour",
      ],
    },
    {
      title: "The Wine Room",
      description:
        "Our private dining room seats up to 24 guests surrounded by a curated 400-bottle wine collection. Perfect for milestone birthdays, anniversaries, and corporate dinners.",
      capacity: "Up to 24 guests",
      features: [
        "Semi-private space with audio system",
        "Customizable 3–5 course menu",
        "Dedicated sommelier",
        "A/V available for presentations",
        "Beverage pairing options",
      ],
    },
    {
      title: "Full Buyout",
      description:
        "Reserve the entire restaurant for your most special occasions. Includes exclusive use of the main dining room, bar, patio, and wine room for up to 80 guests.",
      capacity: "Up to 80 guests",
      features: [
        "Exclusive full-restaurant access",
        "Fully customizable menu",
        "Open bar options",
        "Dedicated event coordinator",
        "Outdoor patio with fireplace",
      ],
    },
  ],

  /* ─── Location / Hours ─────────────────────────── */
  location: {
    address: "42 Elmwood Avenue, Portland, ME 04101",
    phone: "+1 (207) 555-0142",
    hours: [
      { day: "Monday – Thursday", hours: "5:00 PM – 10:00 PM" },
      { day: "Friday – Saturday", hours: "5:00 PM – 11:00 PM" },
      { day: "Sunday", hours: "10:00 AM – 3:00 PM (Brunch) / 5:00 PM – 9:00 PM" },
    ],
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.5!2d-70.266!3d43.657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDM5JzI1LjIiTiA3MMKwMTUnNTcuNiJX!5e0!3m2!1sen!2sus!4v1",
  },

  /* ─── Testimonials (review-style) ──────────────── */
  testimonials: [
    {
      quote:
        "The barramundi was cooked to perfection — crispy skin, flaky centre. The citrus beurre blanc was a revelation. We've already booked our next dinner.",
      author: "Rebecca T.",
      role: "Verified Diner",
      rating: 5,
    },
    {
      quote:
        "We booked the Wine Room for our anniversary. From the amuse-bouche to the petit fours, every detail was flawless. The sommelier paired wines we'd never have chosen ourselves — and they were perfect.",
      author: "Marcus & Elena",
      role: "Private Event Guests",
      rating: 5,
    },
    {
      quote:
        "As a former line cook, I'm hard to impress. Locale's attention to sourcing and technique is genuine — you can taste the difference in every bite. The lamb rack is a masterpiece.",
      author: "David K.",
      role: "Verified Diner",
      rating: 4,
    },
  ],

  phone: "+1 (207) 555-0142",
  whatsapp: "+12075550142",
  ctaLabel: "Book Your Table",
  secondaryCtaLabel: "Call to Book",
  isSampleContent: true,
};

export default restaurant;
