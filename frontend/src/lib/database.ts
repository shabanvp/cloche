/**
 * CLOCHE WEDDING PLATFORM - RENDER POSTGRESQL DATABASE LAYER
 * File: frontend/src/lib/database.ts
 *
 * Dedicated PostgreSQL database layer for Cloche backend services.
 * Reads connection settings strictly from environment variables.
 * Independent of Supabase configuration.
 */

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
