import { prisma } from "@repo/db";
import { tool } from "ai";
import { z } from "zod";

/** DML / DDL keywords that must never be allowed */
const WRITE_PATTERN =
  /^\s*(insert|update|delete|drop|create|alter|truncate|replace|merge|upsert|grant|revoke|call|exec|execute)\b/i;

function assertReadOnly(sql: string): void {
  if (WRITE_PATTERN.test(sql.trim())) {
    throw new Error(
      "Write operations are not permitted. Only SELECT queries are allowed.",
    );
  }
}

/**
 * PostgreSQL aggregate functions (COUNT, SUM, etc.) return BigInt via Prisma.
 * JSON.stringify cannot handle BigInt, so convert to Number here.
 * Precision loss only occurs for integers > 2^53; that won't happen in this app.
 */
function serializeRow(row: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [
      k,
      typeof v === "bigint" ? Number(v) : v,
    ]),
  );
}

export const queryDatabase = tool({
  description:
    "Execute a read-only raw SQL SELECT query against the database. " +
    "Use this for complex analytics, multi-table JOINs, aggregations, and any query that the typed Prisma tools cannot express. " +
    "Only SELECT statements are allowed — any attempt to INSERT, UPDATE, DELETE, or run DDL will be rejected.",

  inputSchema: z.object({
    sql: z
      .string()
      .describe(
        "A valid PostgreSQL SELECT statement. Use table/column names exactly as defined in the schema.",
      ),
  }),

  execute: async ({ sql }) => {
    assertReadOnly(sql);

    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(sql);

    return {
      rowCount: rows.length,
      rows: rows.map(serializeRow),
    };
  },
});
