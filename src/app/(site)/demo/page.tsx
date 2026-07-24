import type { Metadata } from "next";
import { DemoClient } from "@/components/demo/demo-client";

export const metadata: Metadata = {
  title: "Demo Preview",
  description:
    "Switch between pre-built industry website presets — live in front of your clients. No page reload required.",
  robots: { index: false, follow: false },
};

/**
 * /demo Route
 *
 * Client-facing demo tool for pitch meetings. Lets the presenter switch
 * between industry presets (Dental, Gym, Restaurant) and optionally
 * customise the business name/phone live.
 *
 * All content rendered here is sample/placeholder data — see isSampleContent
 * on each BusinessPreset object.
 */
export default function DemoPage() {
  return <DemoClient />;
}
