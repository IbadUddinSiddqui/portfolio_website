import type { BusinessPreset } from "@/types/preset";
import dental from "./dental";
import gym from "./gym";
import restaurant from "./restaurant";

/**
 * All available industry presets for the /demo route.
 * Add new presets by creating a new file and adding it here.
 */
export const presets: BusinessPreset[] = [dental, gym, restaurant];

/**
 * Look up a preset by its id.
 */
export function getPresetById(id: string): BusinessPreset | undefined {
  return presets.find((p) => p.id === id);
}
