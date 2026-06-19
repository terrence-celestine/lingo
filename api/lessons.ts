import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { lessons } from "../src/lib/schema.js";
import { asc } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  const rows = await db.select().from(lessons).orderBy(asc(lessons.order));
  res.json(rows);
}
