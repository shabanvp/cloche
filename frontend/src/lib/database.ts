/**
 * CLOCHE WEDDING PLATFORM - RENDER POSTGRESQL DATABASE LAYER
 * File: frontend/src/lib/database.ts
 *
 * Dedicated PostgreSQL database layer for Cloche backend services.
 * Reads connection settings strictly from environment variables.
 * Independent of Supabase configuration.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined; pool: Pool | undefined };

const connectionString = process.env.DATABASE_URL;

let prisma: PrismaClient;
let pool: Pool;

if (process.env.NODE_ENV === "production") {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set.");
    }
    globalForPrisma.pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    const adapter = new PrismaPg(globalForPrisma.pool);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalForPrisma.prisma;
  pool = globalForPrisma.pool!;
}

export { prisma, pool };

export interface DatabaseConfig {
  connectionString: string | null;
  isConfigured: boolean;
}

/**
 * Retrieves the PostgreSQL connection string dynamically from environment.
 * NEVER hardcodes credentials in source code.
 */
export function getDatabaseUrl(): string | null {
  return process.env.DATABASE_URL || null;
}

/**
 * Returns database configuration status.
 */
export function getDatabaseConfig(): DatabaseConfig {
  const connectionString = getDatabaseUrl();
  return {
    connectionString,
    isConfigured: Boolean(connectionString),
  };
}

/**
 * Helper to check if PostgreSQL connection is configured.
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}
