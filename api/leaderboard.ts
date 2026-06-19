import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { leaderboard } from "../src/lib/schema";
import { desc } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  const rows = await db
    .select()
    .from(leaderboard)
    .orderBy(desc(leaderboard.xp));
  res.json(rows);
}
