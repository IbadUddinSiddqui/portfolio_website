import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/**
 * Prisma Client Singleton (Prisma v7)
 *
 * Uses the @prisma/adapter-neon adapter with @neondatabase/serverless
 * for optimal Neon PostgreSQL performance in serverless environments.
 * Prevents multiple instances during hot-reloading in development.
 *
 * Timeout and error-handling options are configured to prevent
 * connection hangs — particularly important in serverless cold starts.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaNeon(
    {
      connectionString: process.env.DATABASE_URL,
      idleTimeoutMillis: 10000,    // 10s idle before releasing client
      maxLifetimeSeconds: 300,      // 5min max client lifetime
    },
    {
      onPoolError: (err) => {
        console.error("[Neon Pool Error]:", err.message);
      },
      onConnectionError: (err) => {
        console.error("[Neon Connection Error]:", err.message);
      },
    },
  );
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
