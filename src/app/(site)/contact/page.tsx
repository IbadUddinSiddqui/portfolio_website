import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { Mail, Clock, MapPin } from "lucide-react";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch — I'm open to discussing new projects, collaborations, and opportunities.",
};

const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialLinks = [
  { icon: GitHubLogoIcon, label: "GitHub", href: "https://github.com", handle: "@username" },
  { icon: LinkedInLogoIcon, label: "LinkedIn", href: "https://linkedin.com", handle: "in/username" },
  { icon: XIcon, label: "X (Twitter)", href: "https://twitter.com", handle: "@username" },
];

export default function ContactPage() {
  return (
    <div className="container pt-28 pb-section">
      {/* Header */}
      <FadeIn>
        <div className="max-w-2xl mb-16">
          <div className="section-label mb-5">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Contact
          </div>
          <h1 className="text-h1 font-heading font-bold tracking-tight mb-4">
            Let&apos;s work together
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Have a project in mind, a role to discuss, or just want to say hi?
            I&apos;d love to hear from you.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">

        {/* Form */}
        <FadeIn delay={0.1}>
          <div className="rounded-2xl border border-border/50 bg-card-background/50 backdrop-blur-sm p-8">
            <ContactForm />
          </div>
        </FadeIn>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Quick info cards */}
          <FadeIn delay={0.15}>
            <div className="space-y-3">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: contactEmail,
                  href: `mailto:${contactEmail}`,
                },
                {
                  icon: Clock,
                  label: "Response time",
                  value: "Within 24 hours",
                  href: null,
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "San Francisco, CA",
                  href: null,
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-xl border border-border/50 bg-card-background/40 px-4 py-3.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xxs text-muted-foreground/60 uppercase tracking-wider font-medium">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium hover:text-primary transition-colors truncate block"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium truncate">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Social links */}
          <FadeIn delay={0.2}>
            <div className="rounded-xl border border-border/50 bg-card-background/40 p-4">
              <p className="text-xxs text-muted-foreground/60 uppercase tracking-wider font-medium mb-3">
                Social
              </p>
              <div className="flex flex-col gap-2">
                {socialLinks.map(({ icon: Icon, label, href, handle }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-surface-secondary/60 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground/60 font-mono">
                      {handle}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Availability note */}
          <FadeIn delay={0.25}>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3.5 flex items-start gap-3">
              <span className="relative flex h-2 w-2 mt-0.5 shrink-0" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Currently available for freelance projects and full-time roles.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
