import type { Metadata } from "next";
import { FadeIn, Stagger, StaggerItem, GradientText, GlassCard } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Download, GraduationCap, Code2, Sparkles, Terminal, Cpu, Zap, GitBranch, Wifi, CircuitBoard, Atom, Server } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Ibad Uddin — Telecommunication Engineering student at NED University, building software, embedded systems, and automation.",
};

// ─── Hardcoded personal data (editable via admin CMS) ─

const journey = [
  { year: "2021", event: "Started B.E. in Telecommunication Engineering at NED University", icon: GraduationCap },
  { year: "2022", event: "Built first full-stack web application — discovered the joy of building software", icon: Code2 },
  { year: "2022", event: "Began electronics lab work — diodes, transistors, and basic circuits", icon: CircuitBoard },
  { year: "2023", event: "Explored embedded systems with Arduino and C++", icon: Cpu },
  { year: "2023", event: "Started learning MATLAB, Multisim, and LabVIEW for engineering simulations", icon: Atom },
  { year: "2024", event: "Built IoT projects with ESP32 and automation workflows with n8n", icon: Wifi },
  { year: "2024", event: "Developed AI-powered applications and client Shopify projects", icon: Sparkles },
  { year: "2025", event: "Graduating — building this portfolio to showcase the complete engineering journey", icon: Zap },
];

const focusAreas = [
  { title: "Full-Stack Development", description: "Building modern web applications with Next.js, TypeScript, Prisma, and Tailwind CSS. Focused on performance, accessibility, and clean architecture.", icon: Code2, color: "from-blue-500/20 to-cyan-500/20" },
  { title: "Artificial Intelligence", description: "Exploring machine learning for real-world applications — network traffic analysis, lead generation, and automated data extraction.", icon: Sparkles, color: "from-pink-500/20 to-rose-500/20" },
  { title: "Automation", description: "Creating n8n workflows that connect services, process data, and eliminate repetitive tasks — from GitHub syncs to PDF extraction.", icon: Zap, color: "from-amber-500/20 to-yellow-500/20" },
  { title: "Embedded Systems & IoT", description: "Working with Arduino, ESP32, sensors, and wireless communication to build smart devices and IoT dashboards.", icon: Cpu, color: "from-emerald-500/20 to-teal-500/20" },
  { title: "Electronics & PCB Design", description: "Hands-on experience with circuit design, PCB etching, soldering, and simulation tools like Multisim and OrCAD.", icon: CircuitBoard, color: "from-red-500/20 to-orange-500/20" },
  { title: "Engineering Simulations", description: "Using MATLAB and LabVIEW for signal processing, image processing, data acquisition, and system simulation.", icon: Atom, color: "from-violet-500/20 to-purple-500/20" },
];

const skills = [
  { category: "Programming Languages", icon: Code2, items: ["TypeScript", "JavaScript", "Python", "C++", "MATLAB"], color: "from-blue-500/20 to-cyan-500/20" },
  { category: "Frontend", icon: Terminal, items: ["React", "Next.js", "Tailwind CSS", "HTML/CSS", "Radix UI", "Motion"], color: "from-emerald-500/20 to-teal-500/20" },
  { category: "Backend", icon: Server, items: ["Node.js", "Next.js API", "Prisma", "PostgreSQL", "SQLite", "REST APIs"], color: "from-orange-500/20 to-amber-500/20" },
  { category: "AI & Automation", icon: Sparkles, items: ["Python ML", "n8n", "OpenAI API", "OCR", "Data Pipelines"], color: "from-purple-500/20 to-pink-500/20" },
  { category: "Electronics", icon: CircuitBoard, items: ["Arduino", "ESP32", "PCB Design", "Circuit Analysis", "Soldering", "Multisim"], color: "from-red-500/20 to-rose-500/20" },
  { category: "Engineering Software", icon: Atom, items: ["MATLAB", "LabVIEW", "OrCAD", "Multisim", "AutoCAD", "Simulink"], color: "from-violet-500/20 to-purple-500/20" },
  { category: "Developer Tools", icon: Terminal, items: ["Git", "Docker", "Linux", "VS Code", "Figma", "Vercel"], color: "from-slate-500/20 to-gray-500/20" },
  { category: "Networking", icon: Wifi, items: ["Network Analysis", "Protocols", "Signal Processing", "Wireless Comm"], color: "from-blue-500/20 to-indigo-500/20" },
];

export default async function AboutPage() {
  const owner = await db.owner.findFirst();

  return (
    <div className="container py-section">
      {/* ─── Hero ─────────────────────────────────────── */}
      <FadeIn>
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {owner?.location || "Karachi, Pakistan"}
            </span>
            <span className="text-border mx-1.5">·</span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              {owner?.university || "NED University"}
            </span>
            <span className="text-border mx-1.5">·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Batch {owner?.batch || "2025"}
            </span>
          </div>

          <h1 className="text-h1 font-heading font-bold tracking-tight mb-6">
            I&apos;m{" "}
            <GradientText
              as="span"
              from="var(--primary)"
              to="var(--secondary)"
              animate
            >
              Ibad Uddin
            </GradientText>
          </h1>

          <p className="text-body-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
            A telecommunication engineering student with a strong interest in
            both software and hardware. I build full-stack applications, design
            embedded systems, create automation workflows, and experiment with
            electronics — always driven by curiosity and a desire to solve
            practical problems.
          </p>

          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-8">
            My journey started with programming, expanded into web development,
            and gradually grew to include electronics, embedded systems, IoT,
            and AI. I believe the best solutions emerge at the intersection of
            software and hardware, and I&apos;m working toward mastering both
            disciplines.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="default" size="lg" className="rounded-2xl" asChild>
              <a href="/resume.pdf" download>
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </a>
            </Button>
            <Button variant="outline" size="lg" className="rounded-2xl" asChild>
              <Link href="/contact">
                <Zap className="mr-2 h-4 w-4" />
                Let&apos;s Talk
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* ─── Engineering Journey Timeline ────────────── */}
      <section className="mt-32">
        <FadeIn>
          <div className="mb-16">
            <Badge variant="outline" className="mb-4 text-xs tracking-wider uppercase">Journey</Badge>
            <h2 className="text-h2 font-heading font-bold tracking-tight mb-4">Engineering Journey</h2>
            <p className="text-muted-foreground max-w-xl">
              From learning programming to building embedded systems — the path that shaped my engineering mindset.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-border/30 -translate-x-1/2" />

          <Stagger staggerDelay={0.08}>
            {journey.map((item, index) => (
              <StaggerItem key={item.year}>
                <div className="relative flex items-start gap-8 md:gap-0 mb-12 last:mb-0">
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary -translate-x-1/2 z-10 flex items-center justify-center group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-150 transition-transform duration-300" />
                  </div>

                  <div className={`hidden md:flex absolute top-0 ${index % 2 === 0 ? "right-[calc(50%+2rem)]" : "left-[calc(50%+2rem)]"}`}>
                    <span className="text-xs font-bold text-primary tracking-wider">{item.year}</span>
                  </div>

                  <GlassCard className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"} p-6`} glow>
                    <span className="md:hidden text-xs font-bold text-primary tracking-wider mb-2 block">{item.year}</span>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-relaxed">{item.event}</p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ─── Current Focus ──────────────────────────── */}
      <section className="mt-32">
        <FadeIn>
          <div className="mb-16">
            <Badge variant="outline" className="mb-4 text-xs tracking-wider uppercase">Focus</Badge>
            <h2 className="text-h2 font-heading font-bold tracking-tight mb-4">What I&apos;m Building Toward</h2>
            <p className="text-muted-foreground max-w-xl">
              Areas I&apos;m actively exploring and building projects in.
            </p>
          </div>
        </FadeIn>

        <Stagger staggerDelay={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {focusAreas.map((area) => (
              <StaggerItem key={area.title}>
                <GlassCard className="p-6 group relative overflow-hidden h-full" glow>
                  <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <area.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold mb-2">{area.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </section>

      {/* ─── Skills ──────────────────────────────────── */}
      <section className="mt-32">
        <FadeIn>
          <div className="mb-16">
            <Badge variant="outline" className="mb-4 text-xs tracking-wider uppercase">Skills</Badge>
            <h2 className="text-h2 font-heading font-bold tracking-tight mb-4">Technology Stack</h2>
            <p className="text-muted-foreground max-w-xl">
              Tools, languages, and technologies I work with across different domains.
            </p>
          </div>
        </FadeIn>

        <Stagger staggerDelay={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {skills.map((group) => (
              <StaggerItem key={group.category}>
                <GlassCard className="p-6 group relative overflow-hidden" glow>
                  <div className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <group.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-base font-semibold">{group.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/5 text-foreground/80 border border-border/30 hover:border-primary/30 hover:bg-primary/10 transition-all duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </section>

      {/* ─── Education ───────────────────────────────── */}
      <section className="mt-20">
        <FadeIn>
          <div className="mb-10">
            <Badge variant="outline" className="mb-4 text-xs tracking-wider uppercase">Education</Badge>
            <h2 className="text-h2 font-heading font-bold tracking-tight mb-4">Background</h2>
          </div>
        </FadeIn>

        <FadeIn>
          <GlassCard className="p-6 group" glow>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base">B.E. Telecommunication Engineering</h3>
                <p className="text-sm text-primary">NED University of Engineering & Technology</p>
                <p className="text-xs text-muted-foreground mt-0.5">2021 — 2025</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Studying telecommunication engineering with coursework in electronics, embedded systems, signal
                  processing, networking, and communication systems. Building software and hardware projects alongside
                  the curriculum to develop practical engineering skills.
                </p>
              </div>
            </div>
          </GlassCard>
        </FadeIn>
      </section>
    </div>
  );
}
