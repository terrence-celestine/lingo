import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { lessons } from "../src/lib/schema";
import { asc, eq } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  const language = (req.query.language as string) || "Spanish";
  const rows = await db
    .select()
    .from(lessons)
    .where(eq(lessons.language, language))
    .orderBy(asc(lessons.order));
  res.json(rows);
}
