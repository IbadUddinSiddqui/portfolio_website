import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Nunito, Bebas_Neue, Playfair_Display, Lato } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

// ─── Fonts ───────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "monospace"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "sans-serif"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
  preload: true,
  weight: ["400"],
  fallback: ["sans-serif"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  preload: true,
  weight: ["400", "600", "700"],
  fallback: ["Georgia", "serif"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  preload: true,
  weight: ["400", "700"],
  fallback: ["system-ui", "sans-serif"],
});

// ─── Metadata ────────────────────────────────────────

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Portfolio";
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Premium Portfolio Platform";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    url: siteUrl,
    images: [
      {
        url: "/images/logo.png",
        width: 1254,
        height: 1254,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport = {
  themeColor: { color: "#090B10" },
  width: "device-width" as const,
  initialScale: 1,
};

const siteConfig = { name: siteName, url: siteUrl };

// ─── Root Layout ─────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
    <head>
     <script src="https://ai-agent-builder-mvp.vercel.app/widget.js" data-agent-id="e9eb44dc-85b7-489a-b49d-6983b1d9f447" data-position="right" defer></script>
      {/* <link rel="stylesheet" href="https://chatzy-kb-store.s3.amazonaws.com/icons/5ab07987-b5db-477c-82ff-1287e0883acb"/>
<script src="https://chatzy-kb-store.s3.amazonaws.com/icons/56706cc4-b3ba-4eba-9610-f2fb07008a5c" id="2536df02-4b1c-41ca-93b5-cbfbc380abf6" className="chatzy_widget_script" defer></script> */}
    </head>
      <body
        className={cn(
          inter.variable,
          jetbrainsMono.variable,
          nunito.variable,
          bebasNeue.variable,
          playfairDisplay.variable,
          lato.variable,
          "font-body antialiased min-h-screen bg-background text-foreground"
        )}
      >
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
