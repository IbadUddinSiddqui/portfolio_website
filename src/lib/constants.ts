import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

// ─── Navigation ──────────────────────────────────────

export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// ─── Social Links ────────────────────────────────────

interface SocialLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const socialLinks: SocialLink[] = [
  { href: "https://github.com/ibaduddin", label: "GitHub", icon: GitHubLogoIcon },
  { href: "https://linkedin.com/in/ibaduddin", label: "LinkedIn", icon: LinkedInLogoIcon },
];

// ─── Site Config ─────────────────────────────────────

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Ibad Uddin",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Telecommunication Engineering student at NED University. Building software, embedded systems, and automation.",
  tagline: "Engineering ideas into reality — from software to electronics.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og/default.png",
  author: "Ibad Uddin",
};
