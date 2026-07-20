"use server";

import { verifyPassword, setSessionCookie } from "@/lib/auth";

/**
 * Login action — verifies the admin password and sets a session cookie.
 */
export async function login(password: string): Promise<{ success: boolean }> {
  if (!verifyPassword(password)) {
    // Artificial delay to prevent timing attacks
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: false };
  }

  await setSessionCookie();
  return { success: true };
}
