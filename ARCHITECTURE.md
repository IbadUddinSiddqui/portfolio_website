# Portfolio Platform — Architecture Document

> **Version:** 1.0.0  
> **Status:** Architecture Phase (Pre-Implementation)  
> **Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Motion · shadcn/ui · Prisma + SQLite

---

## Table of Contents

1. [Project Philosophy](#1-project-philosophy)
2. [Architecture Overview](#2-architecture-overview)
3. [Folder Structure](#3-folder-structure)
4. [Database Schema](#4-database-schema)
5. [Component Hierarchy](#5-component-hierarchy)
6. [Design System](#6-design-system)
7. [Theme System](#7-theme-system)
8. [Animation Strategy](#8-animation-strategy)
9. [CMS Structure](#9-cms-structure)
10. [Admin Workflow](#10-admin-workflow)
11. [GitHub Integration Workflow](#11-github-integration-workflow)
12. [LinkedIn Workflow](#12-linkedin-workflow)
13. [Notification Workflow](#13-notification-workflow)
14. [Performance Optimization Plan](#14-performance-optimization-plan)
15. [Accessibility Checklist](#15-accessibility-checklist)
16. [SEO Strategy](#16-seo-strategy)
17. [Deployment Strategy](#17-deployment-strategy)
18. [Future Roadmap](#18-future-roadmap)

---

## 1. Project Philosophy

### Core Principles

- **Simplicity over complexity** — Every feature must justify its existence
- **Premium feel** — Inspired by Apple, Linear, Vercel, Stripe, Framer, Raycast
- **Performance is a feature** — 100 Lighthouse scores are non-negotiable
- **Scalability by design** — Architecture supports growing from single portfolio to multi-user SaaS
- **Accessibility is default** — Every component is keyboard-navigable and screen-reader friendly
- **Content-first** — Everything is editable via the admin panel; no hardcoded content

### Design Influences

| Brand | Takeaway |
|-------|----------|
| **Apple** | Typography, spacing, simplicity, material feel |
| **Linear** | Dark mode, micro-interactions, keyboard shortcuts |
| **Vercel** | Developer UX, deployment flow, dashboard design |
| **Stripe** | Payment-grade UI patterns, documentation style |
| **Framer** | Component-based editing, animation system |
| **Raycast** | Command palette, search, keyboard-first navigation |

---

## 2. Architecture Overview

### Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Presentation                      │
│   App Router · Server Components · Client Leaves    │
├─────────────────────────────────────────────────────┤
│                      Features                        │
│   Projects · Blog · Contact · Admin · GitHub        │
├─────────────────────────────────────────────────────┤
│                       Entities                       │
│   User · Project · Blog · Category · Tag · Message  │
├─────────────────────────────────────────────────────┤
│                        Shared                        │
│   UI Components · Hooks · Utils · Animations        │
├─────────────────────────────────────────────────────┤
│                        Data                          │
│   Prisma ORM → SQLite (dev) → PostgreSQL (prod)     │
└─────────────────────────────────────────────────────┘
```

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Routing** | Multi-page (App Router) | Better SEO, code splitting, scale |
| **Rendering** | SSG + ISR for content pages | Maximum performance with fresh content |
| **Data Fetching** | Server Components default | Eliminates client-side waterfalls |
| **Mutations** | Next.js Server Actions | Type-safe, no API boilerplate needed |
| **Database** | Prisma + SQLite (→ PostgreSQL) | ORM abstraction enables seamless migration |
| **Styling** | Tailwind CSS v4 | Utility-first, zero-runtime CSS |
| **Animations** | Motion library (Framer Motion successor) | GPU-accelerated, declarative API |
| **UI Library** | shadcn/ui + custom primitive components | Unstyled, composable, accessible |
| **State** | React hooks + URL search params | No external state library needed for portfolio |

### Why Multi-Page (SSG) over SPA

For a portfolio, **multi-page with SSG is strictly superior:**

1. **SEO** — Each page gets its own metadata, OpenGraph tags, and structured data
2. **Performance** — Static generation means zero server cost for content pages
3. **UX** — App Router's streaming + instant navigation via `prefetch` gives near-SPA feel
4. **Simplicity** — No client-side routing library, simpler caching
5. **Scalability** — Pages can be independently cached/invalidated

---

## 3. Folder Structure

```
├── ARCHITECTURE.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── fonts/
│   ├── images/
│   └── og/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (site)/                   # Public site route group
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx          # Projects list
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Project detail
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── uses/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx            # Site layout (header, footer)
│   │   │   └── not-found.tsx
│   │   ├── admin/                    # Admin route group (protected)
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── layout.tsx            # Admin layout (sidebar + header)
│   │   │   ├── projects/
│   │   │   ├── blog/
│   │   │   ├── media/
│   │   │   ├── themes/
│   │   │   ├── seo/
│   │   │   ├── messages/
│   │   │   └── settings/
│   │   ├── api/                      # API Routes (minimal)
│   │   │   ├── github/
│   │   │   ├── contact/
│   │   │   └── revalidate/
│   │   ├── layout.tsx                # Root layout (fonts, providers)
│   │   └── globals.css               # Global styles + CSS variables
│   ├── components/                   # Shared components
│   │   ├── ui/                       # shadcn/ui base components (button, card, etc.)
│   │   ├── layout/                   # Header, Footer, Navigation, Sidebar
│   │   ├── animations/               # Animation wrappers (fade-in, slide-up, etc.)
│   │   ├── sections/                 # Page sections (Hero, ProjectGrid, etc.)
│   │   └── admin/                    # Admin-specific components
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-mounted.ts
│   │   ├── use-media-query.ts
│   │   ├── use-keyboard-shortcuts.ts
│   │   ├── use-mouse-position.ts
│   │   ├── use-scroll-progress.ts
│   │   └── use-reduced-motion.ts
│   ├── lib/                          # Utilities and shared logic
│   │   ├── db.ts                     # Prisma client singleton
│   │   ├── animations.ts             # Animation variants (Motion)
│   │   ├── utils.ts                  # cn(), formatDate(), etc.
│   │   ├── constants.ts              # Site config, nav links, socials
│   │   ├── seo.ts                    # SEO metadata generator
│   │   └── github.ts                 # GitHub API helpers
│   ├── data/                         # Data access layer (repositories)
│   │   ├── projects.ts
│   │   ├── blog.ts
│   │   ├── messages.ts
│   │   └── settings.ts
│   ├── types/                        # TypeScript types
│   │   ├── project.ts
│   │   ├── blog.ts
│   │   ├── theme.ts
│   │   ├── seo.ts
│   │   └── site.ts
│   ├── providers/                    # React context providers
│   │   ├── theme-provider.tsx
│   │   ├── toast-provider.tsx
│   │   └── admin-provider.tsx
│   └── styles/                       # Additional style utilities
│       ├── animations.css
│       └── themes.css
```

### Feature-Based Module Pattern

Each feature (e.g., `projects/`, `blog/`) follows the same internal structure when complex:

```
features/projects/
├── api/           # Server Actions or API route handlers
├── components/    # Feature-specific components
├── hooks/         # Feature-specific hooks
├── types.ts       # Feature-specific types
└── index.ts       # Public API barrel file
```

---

## 4. Database Schema

### Prisma Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"        // Switch to "postgresql" for production
  url      = env("DATABASE_URL")
}

// ─── User & Auth ─────────────────────────────────────

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}

// ─── Projects ────────────────────────────────────────

model Project {
  id               String          @id @default(cuid())
  title            String
  slug             String          @unique
  description      String
  shortDescription String?
  problem          String?
  solution         String?
  architecture     String?
  lessons          String?
  technologies     String          @default("[]")    // JSON array
  githubUrl        String?
  liveUrl          String?
  linkedinPost     String?
  videoUrl         String?
  featured         Boolean         @default(false)
  pinned           Boolean         @default(false)
  status           ProjectStatus   @default(DRAFT)
  version          String?
  complexity       String?                           // "beginner" | "intermediate" | "advanced" | "expert"
  completionDate   DateTime?
  categoryId       String?
  category         Category?       @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  tags             ProjectTag[]
  images           ProjectImage[]
  timeline         TimelineEntry[]
  seo              SEO?
  githubRepoId     String?         @unique
  githubData       String?                           // JSON: raw GitHub import data
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  publishedAt      DateTime?

  @@index([status, featured])
  @@index([slug])
}

enum ProjectStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model ProjectImage {
  id        String   @id @default(cuid())
  url       String
  alt       String?
  width     Int?
  height    Int?
  order     Int      @default(0)
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
}

model TimelineEntry {
  id          String   @id @default(cuid())
  date        DateTime
  title       String
  description String?
  order       Int      @default(0)
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
}

// ─── Categories & Tags ───────────────────────────────

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  projects Project[]

  @@index([slug])
}

model Tag {
  id       String       @id @default(cuid())
  name     String
  slug     String       @unique
  projects ProjectTag[]

  @@index([slug])
}

model ProjectTag {
  projectId String
  tagId     String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([projectId, tagId])
}

// ─── Blog ────────────────────────────────────────────

model Blog {
  id         String   @id @default(cuid())
  title      String
  slug       String   @unique
  content    String
  excerpt    String?
  coverImage String?
  published  Boolean  @default(false)
  tags       String   @default("[]")    // JSON array of tag names
  seo        SEO?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  publishedAt DateTime?

  @@index([slug, published])
}

// ─── Messages (Contact Form) ─────────────────────────

model Message {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String?
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([read, createdAt])
}

// ─── Site Settings ───────────────────────────────────

model Setting {
  id    String @id @default(cuid())
  key   String @unique
  value String // JSON string — flexible for any setting
}

// ─── Theme ───────────────────────────────────────────

model Theme {
  id        String   @id @default(cuid())
  name      String   @unique
  isActive  Boolean  @default(false)
  config    String   // JSON string: complete theme configuration
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ─── SEO ─────────────────────────────────────────────

model SEO {
  id          String   @id @default(cuid())
  title       String?
  description String?
  ogImage     String?
  ogType      String?  @default("website")
  twitterCard String?  @default("summary_large_image")
  canonical   String?
  projectId   String?  @unique
  project     Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)
  blogId      String?  @unique
  blog        Blog?    @relation(fields: [blogId], references: [id], onDelete: Cascade)
}

// ─── GitHub Sync ─────────────────────────────────────

model GitHubRepo {
  id              String   @id
  name            String
  fullName        String   @unique
  description     String?
  url             String
  homepage        String?
  language        String?
  topics          String   @default("[]")  // JSON array
  stars           Int      @default(0)
  forks           Int      @default(0)
  license         String?
  readme          String?
  imported        Boolean  @default(false)
  projectId       String?  @unique
  project         Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)
  lastSyncedAt    DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([imported])
}

// ─── Notifications ───────────────────────────────────

model Notification {
  id        String   @id @default(cuid())
  type      String   // "new_repo" | "draft_ready" | "contact_message" | etc.
  title     String
  message   String?
  link      String?
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([read, createdAt])
}
```

---

## 5. Component Hierarchy

```
RootLayout
├── ThemeProvider
├── ToastProvider
└── AdminProvider (admin routes only)
    └── SiteLayout
        ├── Header
        │   ├── Logo
        │   ├── DesktopNavigation
        │   ├── MobileNavigation (Sheet)
        │   ├── ThemeSwitcher
        │   └── CommandPalette (⌘K)
        ├── Page (varies by route)
        │   ├── HeroSection
        │   │   ├── AnimatedHeadline
        │   │   ├── DynamicTypingEffect
        │   │   ├── AvailabilityBadge
        │   │   ├── SocialLinks
        │   │   ├── CTAButton
        │   │   ├── ScrollIndicator
        │   │   ├── InteractiveBackground
        │   │   └── TechStackMarquee
        │   ├── ProjectGrid
        │   │   └── ProjectCard
        │   │       ├── ProjectImage (next/image)
        │   │       ├── ProjectTags
        │   │       └── ProjectLinks
        │   ├── ProjectDetail
        │   │   ├── ProjectHero
        │   │   ├── ProjectGallery
        │   │   ├── ProjectTimeline
        │   │   ├── ProjectArchitecture
        │   │   └── RelatedProjects
        │   ├── BlogList
        │   │   └── BlogCard
        │   ├── BlogDetail
        │   │   └── MDXContent
        │   ├── ContactForm
        │   │   ├── FormFields (shadcn/ui)
        │   │   └── SubmitButton (server action)
        │   └── AboutSection
        │       ├── Bio
        │       ├── SkillsCloud
        │       ├── ExperienceTimeline
        │       └── TestimonialCarousel
        └── Footer
            ├── SocialLinks
            ├── Navigation
            ├── NewsletterForm (future)
            └── Copyright

AdminLayout
├── Sidebar
│   ├── Logo
│   ├── NavItems (icon + label)
│   ├── KeyboardShortcutsIndicator
│   └── UserMenu
├── AdminHeader
│   ├── Breadcrumbs
│   ├── SearchInput
│   └── NotificationsDropdown
└── AdminPage
    ├── Dashboard
    │   ├── StatsGrid
    │   │   ├── StatCard (projects)
    │   │   ├── StatCard (blog)
    │   │   ├── StatCard (messages)
    │   │   └── StatCard (github repos)
    │   ├── RecentActivity
    │   ├── DraftsList
    │   └── QuickActions
    ├── ProjectsManager
    │   ├── ProjectsTable
    │   ├── ProjectEditor (form)
    │   │   ├── SlugField (auto-generated)
    │   │   ├── RichTextEditor
    │   │   ├── ImageUploader
    │   │   ├── TagInput
    │   │   ├── TechStackSelector
    │   │   ├── TimelineBuilder
    │   │   ├── SEOSection
    │   │   └── PublishToggle
    │   └── ImportFromGitHubDialog
    ├── BlogManager
    │   ├── BlogTable
    │   └── BlogEditor
    ├── MediaLibrary
    │   └── MediaGrid
    ├── ThemeCustomizer
    │   ├── ColorPicker
    │   ├── FontSelector
    │   ├── BackgroundConfigurator
    │   └── AnimationToggle
    ├── SEOManager
    │   ├── SiteSEOConfig
    │   └── PageSEOEditor
    ├── MessageInbox
    │   └── MessageThread
    ├── GitHubSync
    │   ├── ConnectedRepos
    │   └── PendingImports
    └── Settings
        ├── ProfileSettings
        ├── SiteSettings
        └── IntegrationSettings
```

---

## 6. Design System

### Design Tokens

```
-- primary:        #6366F1 (indigo)
-- primary-foreground: #FFFFFF
-- secondary:      #8B5CF6 (violet)
-- accent:         #06B6D4 (cyan)
-- success:        #10B981 (emerald)
-- warning:        #F59E0B (amber)
-- error:          #EF4444 (red)
-- background:     #FFFFFF / #0A0A0B
-- foreground:     #0A0A0B / #FAFAFA
-- card:           #FAFAFA / #141416
-- border:         #E4E4E7 / #27272A
-- muted:          #F4F4F5 / #18181B
-- ring:           #6366F1
```

### Typography Scale

| Level | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| **h1** | 4.5rem (72px) | 1.0 | 700 (Bold) | -0.02em |
| **h2** | 3rem (48px) | 1.1 | 700 | -0.02em |
| **h3** | 2rem (32px) | 1.2 | 600 | -0.01em |
| **h4** | 1.5rem (24px) | 1.3 | 600 | -0.01em |
| **h5** | 1.25rem (20px) | 1.4 | 600 | - |
| **body** | 1rem (16px) | 1.6 | 400 | - |
| **small** | 0.875rem (14px) | 1.5 | 400 | - |
| **tiny** | 0.75rem (12px) | 1.5 | 400 | - |
| **mono** | 0.875rem | 1.7 | 400 | - |

### Component Library

Based on shadcn/ui with custom overrides for premium feel:

| Component | Notes |
|-----------|-------|
| **Button** | 4 variants (primary, secondary, ghost, outline), 3 sizes, loading state, magnetic hover |
| **Card** | Glass effect option, hover elevation, border gradient |
| **Badge** | Dot indicator, pulse animation for live status |
| **Input** | Floating label, error state, counter |
| **Select** | Custom styled, searchable |
| **Dialog** | Centered, slide-up, backdrop blur |
| **Sheet** | Slide-in panel for mobile nav and admin |
| **Table** | Clean rows, hover highlight, sortable headers |
| **Tabs** | Underline style, animated indicator |
| **Tooltip** | Subtle, delayed, positioned |
| **Toast** | Stackable, swipe to dismiss |

---

## 7. Theme System

### Theme Architecture

```
ThemeProvider (Context)
├── CSS Variables (design tokens)
├── className on <html>
├── localStorage persistence
└── System preference detection
```

### Theme Types

| Theme | Background | Foreground | When |
|-------|-----------|------------|------|
| **Light** | White (#FFF) | Near-black (#0A0A0B) | Default, system preference |
| **Dark** | Near-black (#0A0A0B) | White (#FAFAFA) | System preference, toggle |
| **OLED Dark** | Pure black (#000) | White (#FFF) | OLED screens (pixels off) |
| **Gradient Themes** | Custom | Custom | User-created in admin |

### Theme Configuration (stored as JSON in DB)

```typescript
interface ThemeConfig {
  name: string;
  type: 'light' | 'dark' | 'oled' | 'gradient';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    card: string;
    border: string;
    muted: string;
    ring: string;
  };
  fonts: {
    heading: string;     // Google Font name or system font stack
    body: string;
    mono: string;
    importUrl?: string;  // For Google Fonts
  };
  backgrounds: {
    default: BackgroundConfig;
    sections: Record<string, BackgroundConfig>;
  };
}
```

### Background Configuration

```typescript
interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'animated-gradient' | 'mesh' | 'aurora' | 
        'image' | 'video' | 'noise' | 'glass' | 'blobs';
  value: string;         // Color, gradient CSS, image URL, etc.
  overlay?: boolean;
  noise?: boolean;       // Subtle noise overlay
  animated?: boolean;    // Only for gradient types
}
```

---

## 8. Animation Strategy

### Performance-First Principles

1. **Use CSS transitions/animations whenever possible** — zero JavaScript cost
2. **Motion (Framer Motion successor) only for complex or state-driven animations**
3. **All animations use `transform` and `opacity` only** — GPU accelerated
4. **Respect `prefers-reduced-motion`** — disable or simplify animations
5. **`will-change` on animated elements** — but never over-apply

### Animation Library

```typescript
// lib/animations.ts — Reusable animation variants

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

export const textReveal = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0, 1] } }
};
```

### Animation Components

| Component | Implementation | Performance |
|-----------|---------------|-------------|
| **FadeIn** | `motion.div` with opacity | ✅ GPU |
| **SlideUp** | `motion.div` with `y` + opacity | ✅ GPU |
| **StaggerChildren** | Parent with `stagger` | ✅ GPU |
| **TextReveal** | `motion.div` with `clip-path` | ✅ GPU |
| **MagneticButton** | Mouse-position transform | ✅ GPU |
| **Parallax** | `useScroll` + `useTransform` | ✅ GPU |
| **FloatingElement** | CSS keyframes | ✅ Pure CSS |
| **GlowBorder** | CSS pseudo-element + animation | ✅ Pure CSS |
| **TypingEffect** | `useEffect` with cursor | ⚡ Light JS |
| **ScrollProgress** | `useScroll` hook | ✅ GPU |

### What We WON'T Do

- ❌ No heavy particle systems
- ❌ No Three.js unless strictly necessary and performance-budgeted
- ❌ No large GLTF models
- ❌ No expensive canvas animations
- ❌ No layout-triggering animations (avoid animating `width`, `height`, `top`, `left`)

---

## 9. CMS Structure

### Data Flow

```
Admin Panel (Server Actions)
       │
       ▼
  Prisma Client
       │
       ▼
  SQLite/PostgreSQL
       │
       ▼
  Revalidate Path (on-demand ISR)
       │
       ▼
  Static Site Generation
       │
       ▼
  CDN Cache (Vercel Edge)
```

### Content Types (all editable from admin)

| Type | Fields | Relations |
|------|--------|-----------|
| **Project** | title, slug, description, problem, solution, architecture, lessons, technologies, urls, status, dates | Category, Tags, Images, Timeline, SEO |
| **Blog Post** | title, slug, content, excerpt, cover, published | SEO |
| **Category** | name, slug | Projects |
| **Tag** | name, slug | Projects, Blog |
| **Message** | name, email, subject, message, read | — |
| **Page Content** | hero, about, skills, experience, footer | — (JSON settings) |
| **Theme** | name, config (JSON) | — |
| **SEO** | title, description, ogImage, etc. | Project, Blog |

### Settings Stored as Key-Value (JSON)

```typescript
const SETTING_KEYS = {
  SITE_NAME: 'site_name',
  SITE_DESCRIPTION: 'site_description',
  SITE_URL: 'site_url',
  SOCIAL_LINKS: 'social_links',
  HERO_CONTENT: 'hero_content',
  ABOUT_CONTENT: 'about_content',
  SKILLS: 'skills',
  EXPERIENCE: 'experience',
  FOOTER_CONTENT: 'footer_content',
  NAVIGATION: 'navigation',
  OPENGRAPH_DEFAULT: 'opengraph_default',
  ANALYTICS_ID: 'analytics_id',
} as const;
```

---

## 10. Admin Workflow

### Dashboard

```
┌─────────────────────────────────────────────┐
│  Dashboard                                   │
│                                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ 12   │ │ 5    │ │ 3    │ │ 7    │       │
│  │Proj. │ │Blog  │ │Msgs  │ │Repos │       │
│  └──────┘ └──────┘ └──────┘ └──────┘       │
│                                              │
│  Recent Activity                             │
│  ┌─────────────────────────────────────┐    │
│  │ ○ Published "My Project" just now   │    │
│  │ ○ New contact form message 2m ago   │    │
│  │ ○ New repo detected: "awesome-lib"  │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  Quick Actions                               │
│  [New Project] [Import from GitHub]          │
│  [New Blog Post] [Open Site]                 │
└─────────────────────────────────────────────┘
```

### Project Workflow

```
Create / Import → Draft → Edit → Preview → Publish
                                                  ↓
                                    Auto-generate: OpenGraph, Sitemap, RSS
                                    Notify: Success
```

### GitHub Import Workflow

```
Connect GitHub → Fetch Repos → Select Repo
    ↓
Parse README → Extract: tech stack, description, topics
    ↓
Generate: Project Draft + Case Study Draft + LinkedIn Draft + Blog Draft
    ↓
User Reviews → Edits → Publishes (or schedules)
```

---

## 11. GitHub Integration Workflow

### Architecture

```
┌──────────┐     ┌──────────────┐     ┌─────────┐
│ GitHub   │────▶│ Server Action │────▶│ Prisma  │
│ API      │     │ /api/github   │     │  DB     │
└──────────┘     └──────────────┘     └─────────┘
                       │
                       ▼
                 Notification Created
                       │
                       ▼
                 Admin Notified (UI)
```

### Flow

1. **Connect:** User provides GitHub token → stored in settings
2. **Fetch:** `/api/github/repos` fetches user's repos via GitHub API
3. **Detect:** New repos (not in DB) are flagged as "pending"
4. **Import:** User selects repo → system fetches README, languages, topics
5. **Parse:** AI-assisted parsing extracts:
   - Tech stack from README/language detection
   - Project description from README
   - Topics from GitHub topics
6. **Generate:** Draft project + case study + blog post + LinkedIn post
7. **Review:** User edits drafts in admin before publishing
8. **Store:** `GitHubRepo` record with `imported: true`

### API Rate Limiting

- Cache repo list for 5 minutes
- Respect GitHub API rate limits
- Show last synced timestamp in admin

---

## 12. LinkedIn Workflow

### Architecture

Since LinkedIn's API has strict limitations on automated posting:

```
GitHub Import Complete
       │
       ▼
Generate Post Draft (in-app)
       │
  ┌────┴────┐
  │         │
  ▼         ▼
Short    Long
Version   Version
  │         │
  └────┬────┘
       │
       ▼
Store Draft in DB (Notification)
       │
       ▼
Admin Reviews → Copies → Pastes manually
(Uses clipboard or opens LinkedIn in new tab)
```

### Post Types Generated

| Type | Content | Length |
|------|---------|--------|
| **Short** | Title + 1 key takeaway + CTA | ~150 chars |
| **Long** | Problem → Solution → Architecture → Result → Learnings | ~1000 chars |
| **Hashtags** | 3-5 relevant hashtags | — |
| **Thumbnail** | OG image from project | — |

---

## 13. Notification Workflow

### Notification Types

| Type | Trigger | Display |
|------|---------|---------|
| `new_repo` | GitHub sync detects new repo | Admin badge + dropdown |
| `draft_ready` | GitHub import generates drafts | Admin badge + link to review |
| `contact_message` | New contact form submission | Admin badge + message preview |
| `deployment_success` | Deployment completes | Toast notification |
| `broken_links` | Scheduled link checker | Admin badge |
| `seo_issues` | Scheduled SEO audit | Admin badge |

### Storage

```
Notification Model (Prisma):
├── id (cuid)
├── type (string)
├── title (string)
├── message (string?)
├── link (string?)       // URL to relevant admin page
├── read (boolean)
└── createdAt (datetime)
```

### Delivery Channels

| Channel | Status | Implementation |
|---------|--------|---------------|
| **In-app (admin)** | ✅ Now | Polling on admin layout |
| **Browser** | ✅ Now | Notification API |
| **Email** | 🔜 Future | Resend or SendGrid |
| **Discord** | 🔜 Future | Webhook |
| **Telegram** | 🔜 Future | Bot API |

---

## 14. Performance Optimization Plan

### Target: 100/100/100/100 Lighthouse

### Optimization Matrix

| Area | Technique | Impact |
|------|-----------|--------|
| **Fonts** | `next/font` with `display=swap`, variable fonts, subsetting | 🎯 High |
| **Images** | `next/image` with WebP/AVIF, lazy loading, blur placeholders | 🎯 High |
| **JavaScript** | Server Components by default, client components as leaves | 🎯 High |
| **CSS** | Tailwind JIT (zero unused CSS), CSS variables for theming | 🎯 High |
| **Bundle** | Dynamic imports for heavy components, `next/dynamic` | 🎯 High |
| **Caching** | ISR with on-demand revalidation, `stale-while-revalidate` | 🎯 High |
| **Layout** | Avoid layout shifts, explicit dimensions on all media | 🎯 High |
| **Animations** | GPU-accelerated (transform/opacity), `content-visibility` | 🎯 Medium |
| **Prefetch** | `<Link prefetch>` for instant navigation | 🎯 Medium |
| **Streaming** | `loading.tsx` and `Suspense` boundaries | 🎯 Medium |
| **Scripts** | Defer non-critical scripts, `next/script` strategy | 🎯 Medium |
| **CDN** | Static assets on CDN, immutable caching | 🎯 Medium |

### Bundle Budget

| Resource | Budget |
|----------|--------|
| Initial JS (all pages) | < 100 KB |
| Initial CSS | < 30 KB |
| Fonts | < 50 KB (variable) |
| Images (hero) | < 200 KB |
| Total page weight | < 500 KB |

### Monitoring

- Lighthouse CI in GitHub Actions
- Core Web Vitals in Vercel Analytics
- Bundle analysis with `@next/bundle-analyzer`
- Regular performance audits

---

## 15. Accessibility Checklist

### WCAG 2.2 AA Compliance

#### Structure & Semantics
- [x] Landmark regions (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [x] Heading hierarchy (h1 → h2 → h3, never skip levels)
- [x] Semantic HTML (buttons are `<button>`, links are `<a>`)
- [x] ARIA labels where semantics are insufficient

#### Keyboard Navigation
- [x] All interactive elements reachable via Tab
- [x] Visible focus indicators (custom ring styles)
- [x] No keyboard traps
- [x] Tab order matches visual order
- [x] Shortcut keys for admin (documented)

#### Screen Readers
- [x] Alt text on all images
- [x] ARIA live regions for dynamic content
- [x] Descriptive link text (no "click here")
- [x] Form inputs have associated labels
- [x] Error messages linked to inputs via `aria-describedby`
- [x] Status messages use `role="status"`

#### Visual & Motion
- [x] Contrast ratio ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- [x] `prefers-reduced-motion` respected — animations disabled/simplified
- [x] No content flashes more than 3 times per second
- [x] Text can be zoomed to 200% without loss of content

#### Forms
- [x] Clear error identification
- [x] Success confirmation after submission
- [x] No auto-submit on blur
- [x] Input purpose auto-complete attributes

#### Admin Panel
- [x] All CRUD operations keyboard-accessible
- [x] Modal dialogs trap focus
- [x] Toast notifications announced by screen readers
- [x] Color not the only indicator (icons + text)

---

## 16. SEO Strategy

### Per-Page Metadata Generation

```typescript
// lib/seo.ts
export function generateSEO(params: SEOParams): Metadata {
  return {
    title: `${params.title} | ${siteName}`,
    description: params.description,
    openGraph: {
      title: params.ogTitle || params.title,
      description: params.ogDescription || params.description,
      images: [{ url: params.ogImage || defaultOGImage }],
      type: params.ogType || 'website',
      url: params.canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: params.title,
      description: params.description,
      images: [params.ogImage || defaultOGImage],
    },
    alternates: { canonical: params.canonical },
    robots: params.noIndex ? 'noindex, nofollow' : 'index, follow',
  };
}
```

### Automated SEO Features

| Feature | Implementation |
|---------|---------------|
| **Sitemap** | `app/sitemap.ts` — auto-generated from all content |
| **RSS Feed** | `app/feed.xml/route.ts` — auto-generated from blog |
| **Structured Data** | JSON-LD for Person, Project, BlogPost, BreadcrumbList |
| **OpenGraph Images** | Auto-generated via `@vercel/og` when content published |
| **Canonical URLs** | All pages have canonical link |
| **Breadcrumbs** | Structured breadcrumb data on every page |
| **Metadata** | Every page exports `generateMetadata` |
| **Robots** | `app/robots.ts` — dynamic robots.txt |

---

## 17. Deployment Strategy

### Platform: Vercel (recommended)

```yaml
# vercel.json (recommended config)
{
  "framework": "nextjs",
  "buildCommand": "npx prisma generate && next build",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "crons": [
    {
      "path": "/api/cron/github-sync",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/health-check",
      "schedule": "0 */12 * * *"
    }
  ]
}
```

### Environment Variables

```
DATABASE_URL="file:./dev.db"          # SQLite (dev)
# DATABASE_URL="postgresql://..."     # PostgreSQL (prod)
GITHUB_TOKEN="ghp_..."
NEXT_PUBLIC_SITE_URL="https://..."
RESEND_API_KEY="re_..."              # Future: email
```

### CI/CD Pipeline

```
Git Push → GitHub Actions → Lint → Type Check → Build → Deploy (Vercel)
                                    ↓
                              Prisma Migrate
                                    ↓
                              Revalidate Cache
```

---

## 18. Future Roadmap

### Phase 2: Multi-User & SaaS

- [ ] Authentication (NextAuth.js / Clerk)
- [ ] Role system (admin, editor, viewer)
- [ ] Multi-user portfolio support
- [ ] Portfolio templates marketplace

### Phase 3: Advanced Features

- [ ] Custom domains per portfolio
- [ ] Portfolio marketplace
- [ ] AI assistant for content generation
- [ ] Client dashboard
- [ ] Freelancer CRM

### Phase 4: Monetization

- [ ] Invoice system
- [ ] Subscription tiers
- [ ] Analytics dashboard
- [ ] Resume builder

---

## Appendix A: Key Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "motion": "^11.0.0",
  "lucide-react": "^0.400.0",
  "next-themes": "^0.3.0",
  "prisma": "^5.20.0",
  "@prisma/client": "^5.20.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0",
  "zod": "^3.23.0",
  "sonner": "^1.7.0"
}
```

## Appendix B: Developer Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
npx prisma studio   # Open DB browser
npx prisma migrate  # Run migrations
npx prisma seed     # Seed database
```
