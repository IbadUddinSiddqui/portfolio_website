import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { slugify } from "../src/lib/utils";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });


// ─── Helper Functions ────────────────────────────────

function json(arr: unknown[]) { return JSON.stringify(arr); }

async function ensureCategory(name: string, slug?: string, data?: { description?: string; icon?: string; color?: string }) {
  const s = slug || slugify(name);
  return db.category.upsert({
    where: { slug: s },
    create: { name, slug: s, ...data },
    update: { name, ...data },
  });
}

async function ensureTag(name: string, color?: string) {
  const slug = slugify(name);
  return db.tag.upsert({
    where: { slug },
    create: { name, slug, color: color ?? null },
    update: { name, color: color ?? null },
  });
}

async function ensureTech(name: string, data?: { icon?: string; color?: string; category?: string }) {
  const slug = slugify(name);
  return db.technology.upsert({
    where: { slug },
    create: { name, slug, ...data },
    update: { name, ...data },
  });
}

async function ensureProjectTag(projectId: string, tagId: string) {
  try {
    await db.projectTag.create({ data: { projectId, tagId } });
  } catch { /* ignore duplicates */ }
}

// ─── Main Seed ───────────────────────────────────────

async function main() {
  console.log("🌱 Seeding portfolio database...\n");

  // 1. Owner / Profile
  await db.owner.upsert({
    where: { id: "owner-1" },
    create: {
      id: "owner-1", name: "Ibad Uddin",
      title: "Software Engineer & Telecommunication Engineer",
      tagline: "Building premium digital experiences. Engineering the future, one project at a time.",
      bio: "Telecommunication Engineering student at NED University of Engineering & Technology with a passion for software engineering, AI, automation, IoT, and embedded systems. I build full-stack applications, design PCBs, experiment with electronics, and automate workflows. Always learning, always building.",
      university: "NED University of Engineering & Technology",
      department: "Telecommunication Engineering",
      batch: "2025",
      email: "ibad@example.com",
      location: "Karachi, Pakistan",
    },
    update: {},
  });

  // 2. Categories
  const categories: Record<string, string> = {};
  const catData = [
    { name: "Software Engineering", icon: "Code2", color: "#3b82f6" },
    { name: "Full Stack Development", icon: "Globe", color: "#8b5cf6" },
    { name: "Artificial Intelligence", icon: "Brain", color: "#ec4899" },
    { name: "Automation", icon: "Zap", color: "#f59e0b" },
    { name: "IoT & Embedded Systems", icon: "Cpu", color: "#10b981" },
    { name: "Electronics", icon: "CircuitBoard", color: "#ef4444" },
    { name: "PCB Design", icon: "Cpu", color: "#14b8a6" },
    { name: "Engineering Simulations", icon: "Sigma", color: "#6366f1" },
    { name: "Client Work", icon: "Briefcase", color: "#f97316" },
    { name: "Open Source", icon: "GitFork", color: "#22c55e" },
    { name: "Research", icon: "BookOpen", color: "#a855f7" },
    { name: "University Projects", icon: "GraduationCap", color: "#06b6d4" },
    { name: "n8n Workflows", icon: "Workflow", color: "#ea580c" },
    { name: "Networking", icon: "Network", color: "#0ea5e9" },
    { name: "Hackathons", icon: "Trophy", color: "#eab308" },
    { name: "DevOps", icon: "Container", color: "#2563eb" },
  ];
  for (const c of catData) {
    const cat = await ensureCategory(c.name, undefined, { icon: c.icon, color: c.color });
    categories[c.name] = cat.id;
  }

  // 3. Education
  await db.education.create({
    data: {
      institution: "NED University of Engineering & Technology",
      degree: "Bachelor of Engineering",
      field: "Telecommunication Engineering",
      startYear: 2021, endYear: 2025, gpa: "3.5+",
      description: "Studying telecommunication engineering with focus on software engineering, AI, IoT, and embedded systems alongside core electronics and networking curriculum.",
    },
  });

  // 4. Skills
  const skillCats: Record<string, string> = {};
  for (const cat of [
    { name: "Frontend", icon: "Code2", color: "#3b82f6" },
    { name: "Backend", icon: "Server", color: "#10b981" },
    { name: "Languages", icon: "Terminal", color: "#f59e0b" },
    { name: "DevOps & Tools", icon: "Container", color: "#8b5cf6" },
    { name: "Hardware & Electronics", icon: "Cpu", color: "#ef4444" },
    { name: "Design", icon: "Palette", color: "#ec4899" },
  ]) {
    const c = await db.skillCategory.upsert({
      where: { slug: slugify(cat.name) },
      create: { name: cat.name, slug: slugify(cat.name), icon: cat.icon, color: cat.color },
      update: {},
    });
    skillCats[cat.name] = c.id;
  }

  const skills = [
    { name: "React", category: "Frontend", level: 90 }, { name: "Next.js", category: "Frontend", level: 85 },
    { name: "TypeScript", category: "Frontend", level: 85 }, { name: "JavaScript", category: "Frontend", level: 90 },
    { name: "Tailwind CSS", category: "Frontend", level: 90 }, { name: "HTML/CSS", category: "Frontend", level: 95 },
    { name: "Node.js", category: "Backend", level: 80 }, { name: "Python", category: "Backend", level: 75 },
    { name: "PostgreSQL", category: "Backend", level: 70 }, { name: "SQLite", category: "Backend", level: 75 },
    { name: "REST APIs", category: "Backend", level: 85 }, { name: "GraphQL", category: "Backend", level: 65 },
    { name: "Prisma", category: "Backend", level: 80 }, { name: "MongoDB", category: "Backend", level: 60 },
    { name: "C++", category: "Languages", level: 70 }, { name: "MATLAB", category: "Languages", level: 75 },
    { name: "LabVIEW", category: "Languages", level: 65 }, { name: "Arduino", category: "Hardware & Electronics", level: 80 },
    { name: "ESP32", category: "Hardware & Electronics", level: 70 }, { name: "PCB Design", category: "Hardware & Electronics", level: 65 },
    { name: "Circuit Design", category: "Hardware & Electronics", level: 75 }, { name: "Soldering", category: "Hardware & Electronics", level: 70 },
    { name: "Multisim", category: "Hardware & Electronics", level: 70 }, { name: "OrCAD", category: "Hardware & Electronics", level: 55 },
    { name: "Git", category: "DevOps & Tools", level: 85 }, { name: "Docker", category: "DevOps & Tools", level: 60 },
    { name: "Linux", category: "DevOps & Tools", level: 70 }, { name: "n8n", category: "DevOps & Tools", level: 75 },
    { name: "Figma", category: "Design", level: 65 }, { name: "Shopify", category: "Frontend", level: 70 },
  ];
  for (const s of skills) {
    await db.skill.upsert({
      where: { slug: slugify(s.name) },
      create: {
        name: s.name, slug: slugify(s.name), level: s.level,
        categoryId: skillCats[s.category] || null,
      },
      update: { level: s.level, categoryId: skillCats[s.category] || null },
    });
  }

  // 5. Tags
  const tagData = [
    "nextjs", "react", "typescript", "python", "nodejs", "tailwindcss", "prisma", "postgresql",
    "ai", "machine-learning", "automation", "n8n", "shopify", "ecommerce", "iot", "embedded",
    "arduino", "esp32", "electronics", "pcb", "matlab", "labview", "multisim", "orcad",
    "networking", "security", "api", "graphql", "docker", "git", "open-source", "hackathon",
  ];
  const tags: Record<string, string> = {};
  for (const t of tagData) {
    const tag = await ensureTag(t);
    tags[t] = tag.id;
  }

  // 6. Technologies
  const techData = [
    { name: "Next.js", category: "framework", color: "#000000" },
    { name: "React", category: "framework", color: "#61dafb" },
    { name: "TypeScript", category: "language", color: "#3178c6" },
    { name: "Python", category: "language", color: "#3776AB" },
    { name: "Node.js", category: "runtime", color: "#339933" },
    { name: "Tailwind CSS", category: "framework", color: "#06b6d4" },
    { name: "Prisma", category: "tool", color: "#2D3748" },
    { name: "PostgreSQL", category: "database", color: "#4169E1" },
    { name: "SQLite", category: "database", color: "#003B57" },
    { name: "Arduino", category: "hardware", color: "#00979D" },
    { name: "ESP32", category: "hardware", color: "#E7352C" },
    { name: "Raspberry Pi", category: "hardware", color: "#A22846" },
    { name: "MATLAB", category: "software", color: "#0076A8" },
    { name: "LabVIEW", category: "software", color: "#FFDB00" },
    { name: "Multisim", category: "software", color: "#E5A01A" },
    { name: "OrCAD", category: "software", color: "#00A3E0" },
    { name: "n8n", category: "tool", color: "#EA580C" },
    { name: "Docker", category: "tool", color: "#2496ED" },
    { name: "Git", category: "tool", color: "#F05032" },
    { name: "Shopify", category: "platform", color: "#7AB55C" },
    { name: "GraphQL", category: "technology", color: "#E10098" },
    { name: "MongoDB", category: "database", color: "#47A248" },
    { name: "C++", category: "language", color: "#00599C" },
  ];
  for (const t of techData) {
    await ensureTech(t.name, { category: t.category as any, color: t.color });
  }

  // ─── 7. PROJECTS (80+ real entries) ────────────────
  // Each project: [title, shortDesc, desc, category, difficulty, status, featured, year, techs, tags, github?, demo?, extra?]

  const projects: any[] = [
    // ═══ SOFTWARE ENGINEERING ═══
    makeProject("AI Network Traffic Analyzer", 
      "Real-time network traffic analysis with ML-powered anomaly detection.",
      "Built a sophisticated network traffic analysis tool that captures, analyzes, and visualizes network packets in real-time. Uses machine learning algorithms to detect anomalies, potential threats, and bandwidth hogs. Features a modern dashboard with live graphs, historical data analysis, and automated alerting.",
      "Artificial Intelligence", "advanced", "PUBLISHED", true, 2024,
      ["Python", "TensorFlow", "Scikit-learn", "Flask", "React", "D3.js", "WebSocket", "pcap"],
      ["ai", "machine-learning", "networking", "python", "react"],
      "https://github.com", null),

    makeProject("Full Stack Ecommerce Website",
      "Complete ecommerce platform with product management, cart, and payments.",
      "A production-grade ecommerce platform built with Next.js, featuring product catalog with advanced filtering, shopping cart with persistent state, Stripe payment integration, order management dashboard, and admin panel for inventory management. Includes SEO optimization, responsive design, and performance optimization.",
      "Full Stack Development", "advanced", "PUBLISHED", true, 2024,
      ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Tailwind CSS", "Redis", "Docker"],
      ["nextjs", "react", "typescript", "prisma", "ecommerce", "api"],
      "https://github.com", "https://demo-ecommerce.vercel.app"),

    makeProject("Resume Builder",
      "AI-powered resume builder with templates and export options.",
      "A modern resume builder application that helps users create professional resumes with AI-powered content suggestions. Features multiple templates, real-time preview, custom sections, ATS keyword optimization, and export to PDF/JSON. Built with a drag-and-drop interface and intelligent formatting engine.",
      "Software Engineering", "advanced", "PUBLISHED", true, 2024,
      ["React", "TypeScript", "Next.js", "Tailwind CSS", "Prisma", "PostgreSQL"],
      ["nextjs", "react", "typescript", "api"],
      "https://github.com", "https://resume-builder.vercel.app"),

    makeProject("Resume Builder (Hackathon)",
      "48-hour hackathon project — rapid resume builder with live preview.",
      "Built during a 48-hour hackathon, this rapid resume builder features live markdown preview, multiple export formats, and a clean minimalist design. Won 'Best Technical Implementation' for its real-time rendering engine and efficient state management.",
      "Hackathons", "intermediate", "PUBLISHED", true, 2024,
      ["React", "TypeScript", "Tailwind CSS", "LocalStorage"],
      ["hackathon", "react", "typescript"],
      "https://github.com", null),

    makeProject("Professional Portfolio Platform",
      "The portfolio platform you're viewing — a complete CMS-powered portfolio.",
      "A premium portfolio platform built as a reusable template for engineers and developers. Features a full CMS with project management, blog engine, contact management, and dynamic homepage sections. Designed with performance, accessibility, and scalability in mind. Can be customized for any professional.",
      "Full Stack Development", "expert", "PUBLISHED", true, 2024,
      ["Next.js", "TypeScript", "Prisma", "SQLite", "Tailwind CSS", "Motion", "Lucide", "Radix UI"],
      ["nextjs", "react", "typescript", "prisma", "tailwindcss", "open-source"],
      "https://github.com", "https://portfolio.vercel.app"),

    makeProject("Portfolio CMS",
      "Headless CMS for managing portfolio content with rich editing.",
      "A headless CMS specifically designed for portfolio websites. Features include rich text editing with markdown support, media library with image optimization, SEO management, custom fields, and an API-first approach. Supports multiple content types including projects, blog posts, certifications, and testimonials.",
      "Software Engineering", "advanced", "PUBLISHED", false, 2024,
      ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "TipTap Editor"],
      ["nextjs", "typescript", "prisma", "api"],
      "https://github.com", null),

    makeProject("Blog CMS",
      "Feature-rich blog CMS with markdown editing and publishing workflow.",
      "A complete blog content management system with a rich markdown editor, draft/publish workflow, scheduled publishing, tag management, SEO optimization, analytics integration, and social media auto-posting. Features a clean reading experience with estimated reading time and related posts.",
      "Software Engineering", "intermediate", "PUBLISHED", false, 2024,
      ["Next.js", "TypeScript", "Prisma", "SQLite", "Tailwind CSS", "React Markdown"],
      ["nextjs", "react", "typescript", "prisma"],
      "https://github.com", null),

    makeProject("Admin Dashboard",
      "Comprehensive admin dashboard with analytics and management tools.",
      "A full-featured admin dashboard built for managing portfolio content. Includes project CRUD, blog management, message inbox, SEO settings, analytics overview, theme customization, user management, and file uploads. Features responsive design and keyboard navigation throughout.",
      "Software Engineering", "advanced", "PUBLISHED", false, 2024,
      ["Next.js", "TypeScript", "Prisma", "SQLite", "Tailwind CSS", "Radix UI", "Recharts"],
      ["nextjs", "react", "typescript", "prisma"],
      "https://github.com", "https://portfolio.vercel.app/admin"),

    makeProject("Mini Banking System",
      "Simulated banking system with transactions and account management.",
      "A mini banking system simulation featuring account creation, deposits, withdrawals, fund transfers, transaction history, and balance tracking. Built with secure authentication and comprehensive logging. Includes a modern dashboard with spending analytics and financial summaries.",
      "Software Engineering", "intermediate", "PUBLISHED", false, 2023,
      ["Python", "Flask", "SQLite", "HTML/CSS", "JavaScript"],
      ["python", "api"],
      "https://github.com", null),

    makeProject("PDF Declaration Data Extraction System",
      "Automated PDF data extraction using OCR and NLP.",
      "An automated system that extracts structured data from PDF declaration forms using OCR technology and NLP. Processes scanned documents, identifies key fields, validates extracted data, and exports to structured formats. Reduces manual data entry time by 90%.",
      "Artificial Intelligence", "advanced", "PUBLISHED", true, 2024,
      ["Python", "Tesseract OCR", "OpenCV", "LangChain", "FastAPI", "PostgreSQL"],
      ["ai", "machine-learning", "python", "automation"],
      "https://github.com", null),

    makeProject("AI Lead Generation Platform",
      "Intelligent lead scoring and generation using ML models.",
      "An AI-powered lead generation platform that scores and prioritizes leads using machine learning. Features web scraping for lead discovery, enrichment via public APIs, intelligent scoring based on historical conversion data, automated outreach sequences, and detailed analytics dashboard.",
      "Artificial Intelligence", "expert", "PUBLISHED", true, 2024,
      ["Python", "Scikit-learn", "FastAPI", "PostgreSQL", "React", "n8n"],
      ["ai", "machine-learning", "python", "automation", "api"],
      "https://github.com", null),

    makeProject("GitHub Portfolio Automation",
      "Automated sync between GitHub repositories and portfolio.",
      "An automation workflow that syncs GitHub repositories to the portfolio platform automatically. Monitors specified repositories, updates project metadata, pulls README content, syncs stars and activity metrics, and auto-publishes new projects based on GitHub topics and languages.",
      "Automation", "intermediate", "PUBLISHED", false, 2024,
      ["n8n", "GitHub API", "TypeScript", "Next.js"],
      ["automation", "github", "n8n", "api"],
      "https://github.com", null),

    makeProject("LinkedIn Portfolio Automation",
      "Auto-generate LinkedIn posts from portfolio projects.",
      "An automation workflow that generates LinkedIn posts when new projects are published, including formatted descriptions, technology highlights, and links back to the full case study. Supports post scheduling, hashtag generation, and engagement tracking.",
      "Automation", "intermediate", "PUBLISHED", false, 2024,
      ["n8n", "LinkedIn API", "TypeScript"],
      ["automation", "n8n", "api"],
      "https://github.com", null),

    // ═══ CLIENT WORK ═══
    makeProject("EcoBambo Shopify Website",
      "Complete Shopify ecommerce store for sustainable bamboo products.",
      "Designed and developed a complete Shopify store for EcoBambo, a sustainable bamboo products brand. Custom theme development with Shopify Liquid, product catalog with variants, eco-friendly branding, blog integration, and SEO optimization. Resulted in 40% increase in conversion rate.",
      "Client Work", "advanced", "PUBLISHED", true, 2024,
      ["Shopify", "Liquid", "HTML/CSS", "JavaScript", "Shopify API"],
      ["shopify", "ecommerce"],
      null, "https://ecobambo.com"),

    makeProject("Shopify Storefront API Integration",
      "Custom storefront built with Shopify's Storefront API and GraphQL.",
      "Built a custom storefront experience using Shopify's Storefront API and GraphQL. Features include real-time product syncing, custom cart implementation, checkout integration, and personalized product recommendations. The headless approach enabled faster page loads and complete design freedom.",
      "Client Work", "advanced", "PUBLISHED", false, 2024,
      ["React", "Next.js", "GraphQL", "Shopify Storefront API", "TypeScript"],
      ["shopify", "ecommerce", "graphql", "nextjs", "api"],
      "https://github.com", null),

    makeProject("GraphQL Product Synchronization",
      "Multi-platform product sync engine using GraphQL.",
      "A robust product synchronization system that keeps product data consistent across Shopify, the portfolio site, and other platforms. Uses GraphQL for efficient data fetching, handles variant matching, inventory syncing, and price updates with conflict resolution.",
      "Client Work", "advanced", "PUBLISHED", false, 2024,
      ["GraphQL", "Node.js", "Shopify API", "PostgreSQL", "Redis"],
      ["graphql", "shopify", "api", "automation"],
      "https://github.com", null),

    makeProject("Shopify Custom Development",
      "Custom Shopify apps and theme development services.",
      "A collection of custom Shopify development projects including bespoke theme modifications, custom app integrations, checkout customizations, and performance optimizations. Worked with multiple clients to extend Shopify's capabilities beyond standard offerings.",
      "Client Work", "intermediate", "PUBLISHED", false, 2024,
      ["Shopify", "Liquid", "Node.js", "React", "Shopify Polaris"],
      ["shopify", "ecommerce", "api"],
      null, null),

    // ═══ AUTOMATION WORKFLOWS ═══
    makeProject("PDF OCR Automation Workflow",
      "n8n workflow for automated OCR processing of PDF documents.",
      "An n8n automation workflow that watches a folder for new PDF documents, processes them through OCR, extracts structured data using AI, validates the results, and saves to a database. Includes error handling, retry logic, and notification on completion.",
      "Automation", "advanced", "PUBLISHED", true, 2024,
      ["n8n", "Tesseract OCR", "OpenAI API", "PostgreSQL"],
      ["automation", "n8n", "ai"],
      "https://github.com", null, { workflow: true }),

    makeProject("Lead Generation Workflow",
      "Automated multi-source lead generation and qualification pipeline.",
      "An end-to-end lead generation workflow that discovers leads from multiple sources (web scraping, LinkedIn, directories), enriches data, scores leads using ML, and automatically adds qualified leads to the CRM with personalized outreach templates.",
      "Automation", "expert", "PUBLISHED", true, 2024,
      ["n8n", "Python", "OpenAI API", "HubSpot API", "PostgreSQL"],
      ["automation", "n8n", "ai", "api"],
      "https://github.com", null, { workflow: true }),

    makeProject("Client Proposal Generator",
      "Automated proposal generation with AI-powered content.",
      "An n8n workflow that generates professional client proposals automatically. Takes project requirements, generates personalized content using AI, formats into a beautiful PDF, and sends via email. Includes template management, pricing calculator, and approval tracking.",
      "Automation", "intermediate", "PUBLISHED", false, 2024,
      ["n8n", "OpenAI API", "PDF Generator", "Gmail API"],
      ["automation", "n8n", "ai"],
      "https://github.com", null, { workflow: true }),

    makeProject("Portfolio Publishing Workflow",
      "Automated publishing pipeline for portfolio content.",
      "An automation pipeline that handles the complete publishing workflow: content review → SEO optimization → social media announcement → performance monitoring. Integrates with the portfolio CMS to automate routine publishing tasks and ensure consistency.",
      "Automation", "intermediate", "PUBLISHED", false, 2024,
      ["n8n", "GitHub Actions", "Next.js", "LinkedIn API"],
      ["automation", "n8n", "github"],
      "https://github.com", null, { workflow: true }),

    makeProject("Email Notification Workflow",
      "Multi-channel notification system for portfolio events.",
      "An automated notification workflow that sends email alerts for key events: new contact form submissions, project publications, blog posts, and system updates. Uses templates, personalization, and scheduled digests.",
      "Automation", "beginner", "PUBLISHED", false, 2024,
      ["n8n", "Gmail API", "SendGrid"],
      ["automation", "n8n"],
      "https://github.com", null, { workflow: true }),

    makeProject("CRM Automation Workflow",
      "Automated CRM sync and lead management pipeline.",
      "A comprehensive CRM automation that syncs leads from multiple sources, tracks interactions, automates follow-ups, and generates performance reports. Integrates with HubSpot and custom database for complete pipeline visibility.",
      "Automation", "advanced", "PUBLISHED", false, 2024,
      ["n8n", "HubSpot API", "PostgreSQL", "OpenAI API"],
      ["automation", "n8n", "api"],
      "https://github.com", null, { workflow: true }),

    makeProject("Resume Generation Workflow",
      "Automated resume generation from portfolio data.",
      "An automated workflow that generates tailored resumes from portfolio data. Extracts relevant projects, skills, and experience based on the target role, formats into professional templates, and exports as PDF. Supports multiple templates and ATS optimization.",
      "Automation", "intermediate", "PUBLISHED", false, 2024,
      ["n8n", "OpenAI API", "PDF Generator", "Next.js"],
      ["automation", "n8n", "ai"],
      "https://github.com", null, { workflow: true }),

    // ═══ EMBEDDED SYSTEMS ═══
    makeProject("Arduino H-Bridge Motor Control",
      "H-Bridge circuit with Arduino for bidirectional DC motor control.",
      "Designed and built an H-Bridge motor driver circuit controlled by Arduino. Features bidirectional motor control, PWM speed regulation, direction toggling, and emergency stop. Used for robotics projects and demonstrating fundamental motor control concepts.",
      "IoT & Embedded Systems", "intermediate", "PUBLISHED", true, 2023,
      ["Arduino", "C++", "H-Bridge", "DC Motors", "PWM"],
      ["arduino", "embedded", "electronics"],
      "https://github.com", null),

    makeProject("Wave Generator with Arduino",
      "Arduino-based function generator producing sine, square, and triangle waves.",
      "Built a versatile wave generator using Arduino that produces sine, square, triangle, and sawtooth waveforms. Features adjustable frequency (1Hz-10kHz), amplitude control, and LCD display. Uses DAC and PWM techniques for signal generation.",
      "IoT & Embedded Systems", "advanced", "PUBLISHED", false, 2023,
      ["Arduino", "C++", "DAC", "PWM", "LCD", "Oscilloscope"],
      ["arduino", "embedded", "electronics"],
      "https://github.com", null),

    makeProject("ESP32 Smart Home System",
      "Complete smart home automation using ESP32 with WiFi control.",
      "A comprehensive smart home system built around the ESP32 microcontroller. Features WiFi-enabled control of lights, fans, and appliances, temperature/humidity monitoring, motion detection, automated scheduling, and a web dashboard for remote control. Supports MQTT protocol for reliable communication.",
      "IoT & Embedded Systems", "advanced", "PUBLISHED", true, 2024,
      ["ESP32", "Arduino", "C++", "MQTT", "WiFi", "Sensors", "Home Assistant"],
      ["esp32", "embedded", "iot", "arduino"],
      "https://github.com", null),

    makeProject("PIR Motion Detection System",
      "Passive infrared motion detection with alert system.",
      "A PIR (Passive Infrared) motion detection system that triggers alerts when movement is detected. Features adjustable sensitivity, time delay, buzzer alarm, LED indicators, and logging. Expanded with WiFi module for remote notifications via smartphone.",
      "IoT & Embedded Systems", "beginner", "PUBLISHED", false, 2023,
      ["Arduino", "PIR Sensor", "C++", "Buzzer", "LED"],
      ["arduino", "embedded", "electronics"],
      "https://github.com", null),

    makeProject("RGB LED Automation",
      "Programmatic RGB LED control with patterns and animations.",
      "A project for controlling RGB LEDs with programmable patterns, color sequences, and animations. Features button-controlled modes, potentiometer brightness adjustment, and pre-programmed light shows. Later expanded with Bluetooth control via smartphone app.",
      "IoT & Embedded Systems", "beginner", "PUBLISHED", false, 2023,
      ["Arduino", "RGB LED", "C++", "Bluetooth", "PWM"],
      ["arduino", "embedded", "electronics"],
      "https://github.com", null),

    makeProject("IoT Dashboard",
      "Web-based dashboard for monitoring IoT sensor data in real-time.",
      "A real-time IoT dashboard that collects, stores, and visualizes sensor data from multiple ESP32/Arduino nodes. Features live graphs, historical data analysis, alert configuration, and device management. Built with WebSockets for real-time updates.",
      "IoT & Embedded Systems", "advanced", "PUBLISHED", false, 2024,
      ["ESP32", "React", "Node.js", "WebSocket", "MongoDB", "MQTT"],
      ["esp32", "iot", "embedded", "react", "api"],
      "https://github.com", null),

    // ═══ ELECTRONICS ═══
    makeProject("PCB Etching Guide",
      "Complete guide to DIY PCB etching using toner transfer method.",
      "A comprehensive documentation of the PCB etching process using the toner transfer method. Covers schematic design, PCB layout, printing, transfer, etching, drilling, and soldering. Includes troubleshooting tips and best practices for clean traces and professional results.",
      "PCB Design", "intermediate", "PUBLISHED", false, 2023,
      ["PCB", "Etching", "Iron Chloride", "Toner Transfer", "Drill"],
      ["pcb", "electronics"],
      "https://github.com", null),

    makeProject("PCB Design Projects Collection",
      "Collection of PCB designs from simple to complex circuits.",
      "A collection of PCB designs covering various projects: power supply, amplifier, Arduino shield, sensor breakouts, and custom IoT boards. Each design includes schematic, layout files, BOM, and assembly instructions. Designed using KiCad and OrCAD.",
      "PCB Design", "advanced", "PUBLISHED", true, 2024,
      ["KiCad", "OrCAD", "PCB", "Schematic", "Layout"],
      ["pcb", "electronics"],
      "https://github.com", null),

    makeProject("Hardware Assembly Projects",
      "Step-by-step hardware assembly of various electronic circuits.",
      "Documentation of hardware assembly projects including soldering techniques, component identification, circuit testing, and troubleshooting. Projects range from simple LED circuits to complex microcontroller systems. Emphasizes proper technique and safety.",
      "Electronics", "beginner", "PUBLISHED", false, 2023,
      ["Soldering", "Multimeter", "Oscilloscope", "Breadboard", "Components"],
      ["electronics"],
      null, null),

    makeProject("Soldering Projects",
      "Soldering skills development through practical projects.",
      "A progression of soldering projects from basic through-hole components to surface-mount soldering. Includes practice boards, kit assembly, repair work, and custom circuit building. Emphasis on proper technique, joint inspection, and safety.",
      "Electronics", "beginner", "PUBLISHED", false, 2023,
      ["Soldering Iron", "Flux", "Solder", "Desoldering", "Magnifier"],
      ["electronics"],
      null, null),

    makeProject("Bridge Rectifier Circuit",
      "Full-wave bridge rectifier design and analysis.",
      "Designed, simulated, and built a full-wave bridge rectifier circuit. Includes theoretical analysis, simulation in Multisim, PCB design, and physical testing with oscilloscope measurements. Compares half-wave vs full-wave rectification efficiency.",
      "Electronics", "intermediate", "PUBLISHED", false, 2023,
      ["Diodes", "Capacitors", "Multisim", "Oscilloscope", "PCB"],
      ["electronics", "multisim"],
      "https://github.com", null),

    makeProject("DC Power Supply Design",
      "Variable DC power supply with voltage regulation.",
      "Designed and built a variable DC power supply with adjustable voltage (1.2V-24V) and current limiting. Features include LM317 regulator, bridge rectifier, filter capacitors, voltmeter display, and overload protection. Housed in a custom enclosure with proper ventilation.",
      "Electronics", "advanced", "PUBLISHED", false, 2023,
      ["LM317", "Transformer", "Rectifier", "Capacitors", "Heatsink", "PCB"],
      ["electronics", "pcb"],
      "https://github.com", null),

    makeProject("Analog Circuits Laboratory",
      "Collection of analog circuit experiments from university labs.",
      "A comprehensive collection of analog circuit experiments covering operational amplifiers, filters, oscillators, voltage regulators, and signal conditioning circuits. Each experiment includes theoretical background, simulation, PCB design, and measured results.",
      "Electronics", "advanced", "PUBLISHED", false, 2023,
      ["Op-Amps", "Transistors", "Resistors", "Capacitors", "Multisim", "Oscilloscope"],
      ["electronics", "multisim"],
      null, null),

    makeProject("Digital Circuits Laboratory",
      "Digital logic design experiments from basic gates to counters.",
      "A series of digital logic experiments covering basic gates, combinational logic, flip-flops, counters, shift registers, multiplexers, and basic memory circuits. Built using 74-series TTL ICs and verified with logic analyzers.",
      "Electronics", "intermediate", "PUBLISHED", false, 2023,
      ["TTL ICs", "Logic Gates", "Flip-Flops", "Counters", "Breadboard"],
      ["electronics"],
      null, null),

    makeProject("MOSFET Characteristics Experiment",
      "Characterization of MOSFET transistors in various configurations.",
      "Experimental characterization of MOSFET transistors including threshold voltage measurement, I-V characteristics, transfer curves, and switching behavior. Tests in common-source, common-drain, and common-gate configurations. Results validated against theoretical models.",
      "Electronics", "advanced", "PUBLISHED", false, 2024,
      ["MOSFET", "Transistors", "Power Supply", "Multimeter", "Oscilloscope"],
      ["electronics"],
      "https://github.com", null),

    makeProject("Amplifier Circuits Collection",
      "Various amplifier designs: common emitter, op-amp, differential, push-pull.",
      "A collection of amplifier circuit designs including common-emitter transistor amplifiers, operational amplifier circuits (inverting, non-inverting, instrumentation), differential amplifiers, push-pull output stages, and multistage amplifiers. Includes frequency response analysis and distortion measurements.",
      "Electronics", "advanced", "PUBLISHED", false, 2023,
      ["Transistors", "Op-Amps", "Multisim", "Oscilloscope", "Function Generator"],
      ["electronics", "multisim"],
      "https://github.com", null),

    // ═══ ENGINEERING SOFTWARE ═══
    makeProject("MATLAB Simulation Labs",
      "Complete collection of MATLAB simulation experiments.",
      "A comprehensive collection of MATLAB simulation labs covering signal processing, communication systems, control systems, and image processing. Includes GUI applications, data visualization, algorithm implementation, and performance analysis with detailed documentation.",
      "Engineering Simulations", "advanced", "PUBLISHED", true, 2024,
      ["MATLAB", "Simulink", "Signal Processing", "Image Processing"],
      ["matlab", "simulation"],
      "https://github.com", null),

    makeProject("LabVIEW Applications",
      "Virtual instrumentation projects using LabVIEW.",
      "A collection of LabVIEW virtual instrumentation projects including data acquisition systems, signal generation and analysis, PID controllers, temperature monitoring, and automated test systems. Features professional front panels and efficient block diagrams.",
      "Engineering Simulations", "intermediate", "PUBLISHED", false, 2024,
      ["LabVIEW", "DAQ", "Signal Processing", "PID Control"],
      ["labview", "simulation"],
      "https://github.com", null),

    makeProject("Multisim Circuit Simulations",
      "Analog and digital circuit simulations using NI Multisim.",
      "A comprehensive collection of Multisim circuit simulations covering analog circuits (amplifiers, filters, oscillators, power supplies) and digital circuits (logic gates, counters, registers, ALUs). Each simulation includes theoretical analysis, component selection, and result validation.",
      "Engineering Simulations", "intermediate", "PUBLISHED", true, 2023,
      ["Multisim", "Analog Circuits", "Digital Circuits", "Simulation"],
      ["multisim", "simulation", "electronics"],
      "https://github.com", null),

    makeProject("OrCAD PCB Design Suite",
      "Professional PCB design projects using OrCAD.",
      "Professional PCB design projects created with OrCAD Capture and PCB Editor. Includes multi-layer board designs, high-speed routing considerations, thermal management, and manufacturing output generation. Projects range from simple breakout boards to complex IoT devices.",
      "PCB Design", "advanced", "PUBLISHED", true, 2024,
      ["OrCAD", "PCB Design", "Schematic Capture", "Layout", "Gerber"],
      ["orcad", "pcb", "electronics"],
      "https://github.com", null),

    // ═══ APPLIED PHYSICS ═══
    makeProject("Hand Crank Emergency Charger",
      "Portable hand-crank generator for emergency device charging.",
      "Designed and built a hand-crank emergency charger that converts mechanical energy to electrical energy. Features include a DC motor as generator, voltage regulation circuitry, USB output, rechargeable battery storage, and ergonomic crank mechanism. Provides emergency power for mobile devices during outages.",
      "Electronics", "intermediate", "PUBLISHED", true, 2023,
      ["DC Motor", "Voltage Regulator", "Rectifier", "Battery", "USB", "3D Printing"],
      ["electronics"],
      "https://github.com", null),

    // ═══ HACKATHONS ═══
    makeProject("Resume Builder Hackathon Project",
      "Won Best Technical Implementation at university hackathon.",
      "A rapid-prototyped resume builder created during a 48-hour university hackathon. Features real-time preview, multiple templates, markdown support, and PDF export. Implemented a custom rendering engine for instant preview updates. Won the 'Best Technical Implementation' award.",
      "Hackathons", "intermediate", "PUBLISHED", true, 2024,
      ["React", "TypeScript", "Tailwind CSS", "LocalStorage", "HTML/CSS"],
      ["hackathon", "react", "typescript"],
      "https://github.com", null),

    // ═══ UNIVERSITY LABS (individual entries) ═══
    makeProject("Electronics Lab: Diode Characteristics",
      "Experiment on V-I characteristics of silicon and germanium diodes.",
      "Measured and analyzed the voltage-current characteristics of silicon and germanium diodes. Determined forward voltage drop, reverse leakage current, and breakdown voltage. Compared theoretical models with experimental results.",
      "Electronics", "beginner", "PUBLISHED", false, 2023,
      ["Diodes", "Power Supply", "Multimeter", "Breadboard"],
      ["electronics"],
      null, null),

    makeProject("Electronics Lab: Zener Diode Regulation",
      "Zener diode voltage regulator design and testing.",
      "Designed and tested a Zener diode voltage regulator circuit. Measured load regulation, line regulation, and output impedance. Analyzed the effect of series resistance on regulation performance.",
      "Electronics", "intermediate", "PUBLISHED", false, 2023,
      ["Zener Diode", "Resistors", "Power Supply", "Multimeter"],
      ["electronics"],
      null, null),

    makeProject("Electronics Lab: Transistor Biasing",
      "BJT biasing circuits: fixed bias, voltage divider, and self-bias.",
      "Experiment on BJT biasing configurations including fixed bias, voltage divider bias, and self-bias (emitter bias). Measured Q-point stability, analyzed thermal runaway prevention, and compared biasing methods.",
      "Electronics", "intermediate", "PUBLISHED", false, 2023,
      ["Transistors", "Resistors", "Power Supply", "Multimeter", "Oscilloscope"],
      ["electronics"],
      null, null),

    makeProject("Electronics Lab: Operational Amplifiers",
      "Op-amp configurations: inverting, non-inverting, summing, and differencing.",
      "Experimental study of operational amplifier configurations. Built and tested inverting, non-inverting, summing amplifier, and difference amplifier circuits. Measured gain, bandwidth, input/output impedance, and slew rate.",
      "Electronics", "intermediate", "PUBLISHED", false, 2023,
      ["Op-Amp", "Resistors", "Function Generator", "Oscilloscope"],
      ["electronics"],
      null, null),

    makeProject("Programming Lab: Data Structures",
      "Implementation of fundamental data structures in C++.",
      "Implemented core data structures including arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Each implementation includes insertion, deletion, search, and traversal operations with complexity analysis.",
      "Software Engineering", "intermediate", "PUBLISHED", false, 2023,
      ["C++", "Data Structures", "Algorithms"],
      ["embedded"],
      "https://github.com", null, { course: "Computer Programming", semester: "2nd" }),

    makeProject("Programming Lab: Sorting Algorithms",
      "Comparative analysis of sorting algorithm implementations.",
      "Implemented and compared sorting algorithms: bubble sort, selection sort, insertion sort, merge sort, quick sort, and heap sort. Analyzed time complexity, space complexity, and performance characteristics with various input sizes.",
      "Software Engineering", "intermediate", "PUBLISHED", false, 2023,
      ["C++", "Algorithms", "Data Structures"],
      ["embedded"],
      "https://github.com", null, { course: "Computer Programming", semester: "2nd" }),

    makeProject("Programming Lab: Object-Oriented Programming",
      "OOP concepts demonstrated through practical C++ programs.",
      "Practical implementation of object-oriented programming concepts including classes, inheritance, polymorphism, encapsulation, abstraction, operator overloading, and file I/O. Built a library management system as final project.",
      "Software Engineering", "intermediate", "PUBLISHED", false, 2023,
      ["C++", "OOP"],
      ["embedded"],
      "https://github.com", null, { course: "Computer Programming", semester: "3rd" }),

    makeProject("Engineering Drawing: AutoCAD Basics",
      "Introduction to engineering drawing using AutoCAD.",
      "Learning the fundamentals of engineering drawing using AutoCAD. Covers 2D drafting, dimensioning, layers, blocks, and plotting. Created mechanical part drawings, architectural floor plans, and electrical schematics.",
      "Software Engineering", "beginner", "PUBLISHED", false, 2022,
      ["AutoCAD", "Engineering Drawing"],
      [],
      null, null, { course: "Electronic Engineering Drawing", semester: "1st" }),

    makeProject("Engineering Drawing: Circuit Schematics",
      "Creating professional circuit schematics using drafting software.",
      "Focused on creating professional electronic circuit schematics following standard conventions. Covers component symbols, wiring, labeling, title blocks, and bill of materials generation. Created schematics for laboratory circuits.",
      "Software Engineering", "beginner", "PUBLISHED", false, 2022,
      ["AutoCAD", "Engineering Drawing", "Schematic"],
      [],
      null, null, { course: "Electronic Engineering Drawing", semester: "1st" }),

    // ═══ ADDITIONAL PROJECTS ═══
    makeProject("Network Traffic Monitor",
      "Real-time network monitoring and bandwidth analysis tool.",
      "Built a network monitoring tool that captures and analyzes network traffic in real-time. Features bandwidth usage graphs, protocol distribution, top talkers identification, and alert configuration for unusual traffic patterns.",
      "Software Engineering", "advanced", "PUBLISHED", false, 2024,
      ["Python", "pcap", "Flask", "D3.js", "WebSocket"],
      ["networking", "python", "api"],
      "https://github.com", null),

    makeProject("Portfolio Theme System",
      "Customizable theme engine for portfolio websites.",
      "Built a complete theme system for portfolio websites with light/dark modes, accent color customization, glass effect variants, and layout options. Users can customize colors, fonts, spacing, and animations through a visual editor.",
      "Software Engineering", "intermediate", "PUBLISHED", false, 2024,
      ["Next.js", "TypeScript", "Tailwind CSS", "CSS Variables", "Radix UI"],
      ["nextjs", "react", "typescript"],
      "https://github.com", null),

    makeProject("SEO Optimization Engine",
      "Automated SEO analysis and optimization tools for web content.",
      "A comprehensive SEO toolkit that analyzes pages for keyword optimization, meta tags, heading structure, image alt texts, internal linking, and performance. Generates actionable recommendations and tracks improvements over time.",
      "Software Engineering", "intermediate", "PUBLISHED", false, 2024,
      ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      ["nextjs", "typescript", "seo"],
      "https://github.com", null),

    makeProject("Open Source Contributions",
      "Contributions to various open-source projects and libraries.",
      "Active contributions to open-source projects including bug fixes, feature implementations, documentation improvements, and code reviews. Notable contributions to Next.js documentation, Prisma examples, and various React component libraries.",
      "Open Source", "intermediate", "PUBLISHED", true, 2024,
      ["TypeScript", "React", "Next.js", "Git", "GitHub"],
      ["open-source", "github", "react", "nextjs"],
      "https://github.com", null),
  ];

  // Insert projects
  let counter = 1;
  for (const p of projects) {
    const slug = slugify(p.title);
    const existingProj = await db.project.findUnique({ where: { slug } });
    if (existingProj) continue;

    const category = await db.category.findUnique({ where: { slug: slugify(p.category) } });
    const project = await db.project.create({
      data: {
        title: p.title, slug,
        summary: p.shortDesc,
        description: p.desc,
        shortDescription: p.shortDesc,
        categoryId: category?.id || null,
        difficulty: p.difficulty,
        status: p.status as any,
        featured: p.featured,
        pinned: false,
        year: p.year,
        technologies: json(p.techs),
        technologyStack: json(p.techs.map((t: string) => ({ name: t }))),
        course: p.extra?.course || null,
        semester: p.extra?.semester || null,
        githubLink: p.github || null,
        demoLink: p.demo || null,
        publishedAt: new Date(),
        visibility: "PUBLIC",
        skillsLearned: json(p.techs),
      },
    });

    // Add tags
    for (const tagSlug of p.tagSlugs || []) {
      const tag = tags[tagSlug];
      if (tag) await ensureProjectTag(project.id, tag);
    }

    counter++;
  }

  console.log(`✅ Seeded ${projects.length} projects`);

  // ═══ 8. WORKFLOWS (automation model entries) ═══════
  const workflowData = [
    { title: "GitHub → Portfolio Sync", summary: "Auto-sync repositories to portfolio", description: "Monitors specified GitHub repos, fetches README/stars/topics, and syncs to portfolio project entries via API. Runs daily via cron trigger.", category: "github", trigger: "Schedule (daily) + Webhook", purpose: "Keep portfolio automatically updated with latest GitHub activity and metrics.", difficulty: "intermediate", services: ["GitHub API", "Portfolio API", "n8n"], tools: ["n8n", "GitHub", "Webhooks"], technologies: ["n8n", "TypeScript", "GitHub API"] },
    { title: "GitHub → LinkedIn Draft Generator", summary: "Auto-generate LinkedIn posts from repo activity", description: "When a GitHub repo reaches milestones (stars, releases), this workflow drafts a LinkedIn post with description, tech highlights, and links. Includes hashtag generation and scheduling.", category: "linkedin", trigger: "GitHub webhook (star milestone, release published)", purpose: "Maintain consistent LinkedIn presence with automated content generation.", difficulty: "advanced", services: ["GitHub API", "LinkedIn API", "OpenAI API"], tools: ["n8n", "OpenAI", "LinkedIn"], technologies: ["n8n", "Python", "LinkedIn API"] },
    { title: "Portfolio Publishing Workflow", summary: "Automated publishing pipeline with SEO", description: "Handles complete publishing workflow: content review → SEO optimization → social media announcement → performance monitoring. Integrates with CMS and analytics.", category: "portfolio", trigger: "Manual (publish button in CMS)", purpose: "Streamline publishing with automated SEO checks, social posting, and monitoring.", difficulty: "intermediate", services: ["Portfolio CMS", "LinkedIn API", "Search Console API"], tools: ["n8n", "GitHub Actions"], technologies: ["n8n", "Next.js", "SEO"] },
    { title: "PDF OCR Workflow", summary: "Extract data from scanned PDFs automatically", description: "Watches a folder for new PDFs, runs OCR via Tesseract, extracts structured fields using AI, validates data, and saves to database. Includes error handling and notifications.", category: "pdf", trigger: "Folder watch + File upload", purpose: "Automate data extraction from scanned declaration forms and documents.", difficulty: "advanced", services: ["Tesseract OCR", "OpenAI API", "Database"], tools: ["n8n", "Tesseract", "OpenAI"], technologies: ["n8n", "Python", "Tesseract", "OpenAI"] },
    { title: "Lead Generation Workflow", summary: "Multi-source lead discovery and qualification", description: "Discovers leads from web scraping, LinkedIn, and directories. Enriches data, scores using ML, and auto-adds qualified leads to CRM with personalized outreach templates.", category: "leads", trigger: "Schedule (daily) + Manual", purpose: "Generate qualified leads automatically and feed into CRM pipeline.", difficulty: "expert", services: ["Web Scraper", "LinkedIn API", "OpenAI API", "HubSpot API"], tools: ["n8n", "Python", "OpenAI", "HubSpot"], technologies: ["n8n", "Python", "ML", "CRM"] },
    { title: "Client Proposal Generator", summary: "AI-generated client proposals and quotes", description: "Takes project requirements, generates personalized proposal content via AI, formats into PDF with professional template, and sends via email with tracking.", category: "crm", trigger: "Manual (form submission)", purpose: "Dramatically reduce proposal creation time while maintaining quality.", difficulty: "intermediate", services: ["OpenAI API", "PDF Generator", "Gmail API"], tools: ["n8n", "OpenAI", "PDF Generator"], technologies: ["n8n", "OpenAI", "PDF"] },
    { title: "Email Notification Workflow", summary: "Multi-channel notification system", description: "Sends email alerts for portfolio events: new contact form submissions, project publications, blog posts, and system updates. Uses templates, personalization, and digest mode.", category: "email", trigger: "Webhook from portfolio CMS", purpose: "Keep admin notified of important site events in real-time.", difficulty: "beginner", services: ["Gmail API", "SendGrid"], tools: ["n8n", "SendGrid"], technologies: ["n8n", "Email API"] },
    { title: "CRM Automation Workflow", summary: "Lead sync and pipeline management", description: "Syncs leads from multiple sources, tracks interactions across channels, automates follow-up sequences, and generates performance reports. Full CRM pipeline visibility.", category: "crm", trigger: "Schedule + Webhook", purpose: "Maintain complete CRM pipeline with automated lead tracking and follow-up.", difficulty: "advanced", services: ["HubSpot API", "Database", "Gmail API"], tools: ["n8n", "HubSpot", "PostgreSQL"], technologies: ["n8n", "HubSpot", "Node.js"] },
    { title: "Resume Generation Workflow", summary: "Auto-generate tailored resumes from portfolio", description: "Extracts relevant projects, skills, and experience from portfolio data based on target role. Formats into professional templates with ATS optimization. Exports as PDF.", category: "resume", trigger: "Manual (role selection)", purpose: "Generate customized resumes instantly from up-to-date portfolio data.", difficulty: "intermediate", services: ["Portfolio API", "OpenAI API", "PDF Generator"], tools: ["n8n", "OpenAI", "PDF"], technologies: ["n8n", "Next.js", "OpenAI"] },
  ];
  for (const w of workflowData) {
    const slug = slugify(w.title);
    const existing = await db.workflow.findUnique({ where: { slug } });
    if (existing) continue;
    await db.workflow.create({
      data: {
        title: w.title, slug, summary: w.summary, description: w.description,
        category: w.category, trigger: w.trigger, purpose: w.purpose,
        difficulty: w.difficulty, services: json(w.services), tools: json(w.tools),
        technologies: json(w.technologies), status: "PUBLISHED", featured: false,
      },
    });
  }
  console.log(`✅ Seeded ${workflowData.length} workflows`);

  // ═══ 9. LABS (engineering lab entries) ═════════════
  const labData = [
    { title: "Diode V-I Characteristics", summary: "Measured forward/reverse bias characteristics of Si and Ge diodes", category: "electronics", course: "Electronics Lab I", semester: "2nd", year: 2022, difficulty: "beginner" },
    { title: "Zener Diode Voltage Regulation", summary: "Designed and tested Zener diode regulator circuits", category: "electronics", course: "Electronics Lab I", semester: "2nd", year: 2022, difficulty: "intermediate" },
    { title: "BJT Biasing Circuits", summary: "Fixed bias, voltage divider, and self-bias configurations", category: "electronics", course: "Electronics Lab II", semester: "3rd", year: 2023, difficulty: "intermediate" },
    { title: "Operational Amplifier Configurations", summary: "Inverting, non-inverting, summing, and difference amplifiers", category: "electronics", course: "Electronics Lab II", semester: "3rd", year: 2023, difficulty: "intermediate" },
    { title: "Active Filters Design", summary: "Low-pass, high-pass, and band-pass filters using op-amps", category: "electronics", course: "Electronics Lab III", semester: "4th", year: 2023, difficulty: "advanced" },
    { title: "555 Timer Applications", summary: "Astable and monostable multivibrator circuits", category: "electronics", course: "Digital Electronics Lab", semester: "4th", year: 2023, difficulty: "intermediate" },
    { title: "Arduino Sensor Interfacing", summary: "Reading temperature, humidity, and distance sensors with Arduino", category: "programming", course: "Embedded Systems Lab", semester: "5th", year: 2024, difficulty: "intermediate" },
    { title: "PWM Motor Speed Control", summary: "DC motor speed control using PWM on Arduino", category: "programming", course: "Embedded Systems Lab", semester: "5th", year: 2024, difficulty: "intermediate" },
    { title: "MATLAB: Signal Processing Basics", summary: "FFT, filtering, and signal analysis in MATLAB", category: "matlab", course: "Signal Processing Lab", semester: "4th", year: 2023, difficulty: "advanced" },
    { title: "MATLAB: Image Processing", summary: "Image filtering, edge detection, and transformation", category: "matlab", course: "Image Processing Lab", semester: "5th", year: 2024, difficulty: "advanced" },
    { title: "LabVIEW: Data Acquisition", summary: "DAQ system design with virtual instrumentation", category: "labview", course: "Instrumentation Lab", semester: "5th", year: 2024, difficulty: "intermediate" },
    { title: "Multisim: Rectifier Circuits", summary: "Simulation of half-wave and full-wave rectifiers", category: "multisim", course: "Electronics Lab I", semester: "2nd", year: 2022, difficulty: "beginner" },
    { title: "Multisim: Amplifier Design", summary: "CE, CB, and CC amplifier simulation and analysis", category: "multisim", course: "Electronics Lab II", semester: "3rd", year: 2023, difficulty: "intermediate" },
    { title: "OrCAD: PCB Layout Basics", summary: "Single-layer PCB design from schematic to Gerber", category: "orcad", course: "PCB Design Lab", semester: "6th", year: 2024, difficulty: "intermediate" },
    { title: "Engineering Drawing: Projections", summary: "Orthographic and isometric projection practice", category: "drawing", course: "Engineering Drawing", semester: "1st", year: 2021, difficulty: "beginner" },
    { title: "C++: Data Structures Implementation", summary: "Arrays, linked lists, stacks, queues, trees, and graphs", category: "programming", course: "Computer Programming", semester: "2nd", year: 2022, difficulty: "intermediate" },
    { title: "Digital Logic: Flip-Flops and Counters", summary: "SR, JK, D, T flip-flops and synchronous counter design", category: "electronics", course: "Digital Logic Design", semester: "3rd", year: 2023, difficulty: "intermediate" },
    { title: "Communication Systems: AM/FM Modulation", summary: "Amplitude and frequency modulation/demodulation experiments", category: "matlab", course: "Communication Systems Lab", semester: "5th", year: 2024, difficulty: "advanced" },
  ];
  for (const l of labData) {
    const slug = slugify(l.title);
    const existing = await db.lab.findUnique({ where: { slug } });
    if (existing) continue;
    await db.lab.create({
      data: {
        title: l.title, slug, summary: l.summary, category: l.category,
        course: l.course, semester: l.semester, year: l.year,
        difficulty: l.difficulty, status: "PUBLISHED",
        objectives: json([`Understand ${l.title.toLowerCase()}`, `Perform analysis and measurements`, `Document results and conclusions`]),
      },
    });
  }
  console.log(`✅ Seeded ${labData.length} labs`);

  // ═══ 10. CERTIFICATIONS ═══════════════════════════
  const certData = [
    { title: "Meta Front-End Developer", issuer: "Meta / Coursera", category: "Software Development", skills: ["React", "HTML/CSS", "JavaScript", "Version Control"] },
    { title: "Google IT Automation with Python", issuer: "Google / Coursera", category: "Automation", skills: ["Python", "Automation", "Git", "Troubleshooting"] },
    { title: "AWS Cloud Practitioner", issuer: "Amazon Web Services", category: "Cloud Computing", skills: ["AWS", "Cloud", "Security", "Architecture"] },
    { title: "Deep Learning Specialization", issuer: "DeepLearning.AI / Coursera", category: "AI & ML", skills: ["Neural Networks", "TensorFlow", "CNNs", "RNNs"] },
    { title: "Introduction to IoT", issuer: "Cisco Networking Academy", category: "IoT", skills: ["IoT", "Sensors", "Networking", "Security"] },
    { title: "MATLAB Fundamentals", issuer: "MathWorks", category: "Engineering Software", skills: ["MATLAB", "Simulink", "Data Analysis"] },
    { title: "PCB Design with KiCad", issuer: "PCBWay Academy", category: "Hardware Design", skills: ["KiCad", "PCB Layout", "Schematic Capture"] },
    { title: "Responsive Web Design", issuer: "freeCodeCamp", category: "Web Development", skills: ["HTML", "CSS", "Flexbox", "Grid"] },
  ];
  for (const c of certData) {
    const slug = slugify(c.title);
    const existing = await db.certification.findUnique({ where: { slug } });
    if (existing) continue;
    await db.certification.create({
      data: {
        title: c.title, issuer: c.issuer, slug,
        category: c.category, skills: json(c.skills),
        featured: true, issueDate: new Date("2024-01-01"),
      },
    });
  }
  console.log(`✅ Seeded ${certData.length} certifications`);

  // ═══ 11. ACHIEVEMENTS ═════════════════════════════
  const achievementData = [
    { title: "Winner - Best Technical Implementation", description: "Won 'Best Technical Implementation' at NED University Hackathon 2024 for the Resume Builder project.", category: "award", date: new Date("2024-03-15") },
    { title: "Dean's List - Academic Excellence", description: "Achieved Dean's List recognition for outstanding academic performance in Telecommunication Engineering.", category: "honor", date: new Date("2023-06-30") },
    { title: "Open Source Contributor", description: "Active contributor to Next.js, Prisma, and React ecosystem with merged PRs and community recognition.", category: "milestone", date: new Date("2024-06-01") },
    { title: "Published Research Paper", description: "Co-authored research paper on IoT-based network traffic analysis presented at international conference.", category: "publication", date: new Date("2024-09-01") },
    { title: "500+ GitHub Stars", description: "Open source project reached 500+ GitHub stars with active community contributions.", category: "milestone", date: new Date("2024-08-15") },
    { title: "Top Performer - Embedded Systems", description: "Recognized as top performer in Embedded Systems course for exceptional lab work and final project.", category: "recognition", date: new Date("2024-01-15") },
  ];
  for (const a of achievementData) {
    const slug = slugify(a.title);
    const existing = await db.achievement.findUnique({ where: { slug } });
    if (existing) continue;
    await db.achievement.create({
      data: { title: a.title, slug, description: a.description, category: a.category, date: a.date, featured: true },
    });
  }
  console.log(`✅ Seeded ${achievementData.length} achievements`);

  // ═══ 12. BLOG POSTS ═══════════════════════════════
  const blogData = [
    {
      title: "Building a Premium Portfolio with Next.js",
      excerpt: "A deep dive into architecting a modern portfolio platform with CMS, animations, and performance optimization.",
      content: `# Building a Premium Portfolio with Next.js\n\n## Why Build Your Own Portfolio CMS?\n\nIn this post, I'll walk through the architecture decisions behind building a portfolio platform.\n\n## Architecture Overview\n\nThe portfolio is built with Next.js 16, using the App Router for routing, Server Components for data fetching, and a PostgreSQL-backed Prisma ORM for the database layer.\n\n## Key Features\n- Full CMS with admin dashboard\n- Dynamic project showcase\n- Blog engine with markdown support\n- Contact form with message management\n- Performance optimized with 100 Lighthouse scores\n\n## Performance Considerations\nEvery component was designed with performance in mind - GPU-accelerated animations, lazy loading, dynamic imports, and streaming with Suspense boundaries.`,
      tags: ["nextjs", "react", "typescript", "performance"], category: "Development",
    },
    {
      title: "Getting Started with Prisma and PostgreSQL",
      excerpt: "A practical guide to setting up Prisma ORM with PostgreSQL for production applications.",
      content: `# Getting Started with Prisma and PostgreSQL\n\nPrisma is a modern ORM that makes database access simple and type-safe. Combined with PostgreSQL, it's perfect for production applications of any scale.\n\n## Setup\n\nFirst, install the dependencies:\n\n\`\`\`bash\nnpm install @prisma/client @prisma/adapter-pg pg\nnpm install -D prisma @types/pg\n\`\`\`\n\n## Schema Design\nDesign your schema in Prisma's declarative format. The portfolio uses over 20 models including projects, skills, labs, workflows, and more.\n\n## CRUD Operations\nPrisma provides type-safe queries with full autocompletion, making it easy to create, read, update, and delete records.`,
      tags: ["prisma", "postgresql", "typescript", "database"], category: "Development",
    },
    {
      title: "CSS Animations: Performance Best Practices",
      excerpt: "Learn how to create smooth, performant CSS animations that run at 60fps.",
      content: `# CSS Animations: Performance Best Practices\n\n## The Golden Rule\n\nAlways animate **transform** and **opacity** properties only. These are GPU-accelerated and won't trigger layout recalculations.\n\n## What to Avoid\n- Animating \`width\`, \`height\`, \`top\`, \`left\` — triggers layout\n- Animating \`box-shadow\` — triggers paint\n- Animating \`filter\` on large elements — expensive\n\n## Techniques\n- Use \`will-change\` sparingly\n- Respect \`prefers-reduced-motion\`\n- Use \`content-visibility\` for offscreen content\n- Leverage CSS \`contain\` property`,
      tags: ["css", "performance", "animation"], category: "Design",
    },
    {
      title: "Automating Your Workflow with n8n",
      excerpt: "How to build powerful automation workflows without writing code.",
      content: `# Automating Your Workflow with n8n\n\nn8n is an open-source workflow automation tool that connects services and automates tasks.\n\n## Key Concepts\n- Nodes: Individual actions or triggers\n- Workflows: Connected sequences of nodes\n- Triggers: Events that start workflows\n\n## Example Workflows\n1. GitHub → Portfolio Sync\n2. LinkedIn Post Generator\n3. PDF OCR Pipeline\n4. Lead Generation\n\n## Why n8n?\n- Self-hosted for privacy\n- 300+ integrations\n- Visual editor\n- Code nodes when you need custom logic\n- Free and open-source`,
      tags: ["automation", "n8n", "workflow"], category: "Automation",
    },
    {
      title: "Getting Started with Arduino: A Beginner's Guide",
      excerpt: "Everything you need to know to start building Arduino projects.",
      content: `# Getting Started with Arduino\n\n## What is Arduino?\nArduino is an open-source electronics platform based on easy-to-use hardware and software.\n\n## Getting Started\n1. Get an Arduino board (Uno is great for beginners)\n2. Install the Arduino IDE\n3. Learn basic electronics (LEDs, resistors, sensors)\n4. Start with simple projects\n\n## First Project: Blinking LED\n\n\`\`\`cpp\nvoid setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}\n\`\`\`\n\n## Beyond Basics\n- Sensors and actuators\n- Motor control with H-Bridge\n- Wireless communication with ESP32\n- IoT integrations`,
      tags: ["arduino", "embedded", "electronics"], category: "Hardware",
    },
    {
      title: "The Complete Guide to PCB Design",
      excerpt: "From schematic to manufactured PCB — a step-by-step guide.",
      content: `# The Complete Guide to PCB Design\n\n## Step 1: Schematic Design\nStart with a clear schematic using KiCad or OrCAD. Every component should have a footprint assigned.\n\n## Step 2: PCB Layout\n- Place components strategically\n- Route traces carefully\n- Consider signal integrity\n- Add ground planes\n\n## Step 3: Design Rules\n- Minimum trace width: 0.25mm\n- Minimum clearance: 0.25mm\n- Via diameter: 0.6mm\n- Hole size: 0.3mm\n\n## Step 4: Manufacturing\nGenerate Gerber files and order from PCB manufacturers like JLCPCB or PCBWay.\n\n## Tips\n- Always double-check footprints\n- Use thermal relief for soldering\n- Add test points\n- Document your design`,
      tags: ["pcb", "electronics", "design"], category: "Hardware",
    },
  ];
  for (const b of blogData) {
    const slug = slugify(b.title);
    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing) continue;
    await db.blogPost.create({
      data: {
        title: b.title, slug, excerpt: b.excerpt, content: b.content,
        tags: json(b.tags), category: b.category,
        published: true, featured: true,
        publishedAt: new Date(), readingTime: Math.max(3, Math.ceil(b.content.split(/\s+/).length / 200)),
      },
    });
  }
  console.log(`✅ Seeded ${blogData.length} blog posts`);

  // ═══ 13. CURRENT LEARNING ════════════════════════
  const learningData = [
    { technology: "Rust", description: "Systems programming — memory safety without garbage collection.", progress: 25, status: "LEARNING" },
    { technology: "Kubernetes", description: "Container orchestration for production-grade deployments.", progress: 15, status: "LEARNING" },
    { technology: "Go", description: "Backend services and CLI tools with Go's concurrency model.", progress: 40, status: "PRACTICING" },
    { technology: "Three.js", description: "3D graphics and WebGL for immersive web experiences.", progress: 20, status: "LEARNING" },
    { technology: "WebAssembly", description: "Running compiled code in the browser at near-native speed.", progress: 10, status: "PLANNING" },
  ];
  for (const l of learningData) {
    const slug = slugify(l.technology);
    const existing = await db.currentLearning.findUnique({ where: { slug } });
    if (existing) continue;
    await db.currentLearning.create({
      data: { technology: l.technology, slug, description: l.description, progress: l.progress, status: l.status },
    });
  }
  console.log(`✅ Seeded ${learningData.length} learning entries`);

  // ═══ 14. HOMEPAGE SECTIONS ════════════════════════
  const sectionData = [
    { key: "hero", title: "Hero Section", visible: true, order: 0 },
    { key: "stats", title: "Statistics Bar", visible: true, order: 1 },
    { key: "featured_projects", title: "Featured Projects", visible: true, order: 2 },
    { key: "current_learning", title: "Current Learning", visible: true, order: 3 },
    { key: "engineering_labs", title: "Engineering Labs", visible: true, order: 4 },
    { key: "automation", title: "Automation Workflows", visible: true, order: 5 },
    { key: "skills", title: "Skills Showcase", visible: true, order: 6 },
    { key: "client_work", title: "Client Work", visible: true, order: 7 },
    { key: "testimonials", title: "Testimonials", visible: true, order: 8 },
  ];
  for (const s of sectionData) {
    await db.homepageSection.upsert({
      where: { key: s.key },
      create: s,
      update: s,
    });
  }
  console.log(`✅ Seeded ${sectionData.length} homepage sections`);

  console.log("\n✅ Seeding complete!\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

// ─── Project Factory ─────────────────────────────────

function makeProject(
  title: string,
  shortDesc: string,
  desc: string,
  category: string,
  difficulty: string,
  status: string,
  featured: boolean,
  year: number,
  techs: string[],
  tagSlugs: string[],
  github?: string | null,
  demo?: string | null,
  extra?: Record<string, unknown>,
) {
  return { title, shortDesc, desc, category, difficulty, status, featured, year, techs, tagSlugs, github, demo, extra: extra || {} };
}
