import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

// ─── Constants ───────────────────────────────────────

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION = 60 * 60 * 24; // 24 hours

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SECRET || "dev-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

function getPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

// ─── Session Types ───────────────────────────────────

interface SessionPayload extends JWTPayload {
  role: "admin";
  authenticatedAt: number;
}

// ─── Session Operations ──────────────────────────────

/**
 * Create a JWT session token for the admin user.
 */
export async function createSession(): Promise<string> {
  const token = await new SignJWT({
    role: "admin",
    authenticatedAt: Date.now(),
  } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());

  return token;
}

/**
 * Verify a session token and return the payload if valid.
 */
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Verify the admin password.
 */
export function verifyPassword(password: string): boolean {
  return password === getPassword();
}

// ─── Cookie Helpers (Server Components / Actions) ────

/**
 * Set the admin session cookie.
 */
export async function setSessionCookie(): Promise<void> {
  const token = await createSession();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/admin",
  });
}

/**
 * Remove the admin session cookie (logout).
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Check if the current request has a valid admin session.
 * Can be used in middleware or server components.
 */
export async function hasValidSession(
  tokenValue?: string
): Promise<boolean> {
  if (tokenValue) {
    const payload = await verifySession(tokenValue);
    return payload !== null && payload.role === "admin";
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const payload = await verifySession(token);
  return payload !== null && payload.role === "admin";
}
