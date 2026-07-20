import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Prisma Client Singleton (Prisma v7)
 *
 * Uses the @prisma/adapter-better-sqlite3 adapter for SQLite support.
 * Prevents multiple instances during hot-reloading in development.
 * 
 * When migrating to PostgreSQL:
 * 1. Install @prisma/adapter-pg
 * 2. Change import to PrismaPg
 * 3. Update the adapter instantiation
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./dev.db",
  });

  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
