import type { IndustryTheme, ThemeRegistry } from "./theme.types";
import dentalTheme from "./dental.theme";
import gymTheme from "./gym.theme";
import restaurantTheme from "./restaurant.theme";

/**
 * All available industry themes for the /demo route.
 * Add new themes by creating a new file and adding it here.
 */
export const themes: IndustryTheme[] = [dentalTheme, gymTheme, restaurantTheme];

/**
 * Registry keyed by theme id for fast lookups.
 */
export const themeRegistry: ThemeRegistry = Object.fromEntries(
  themes.map((t) => [t.id, t])
);

/**
 * Look up a theme by its id.
 */
export function getThemeById(id: string): IndustryTheme | undefined {
  return themeRegistry[id];
}
