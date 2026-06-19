import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { questions } from "../src/lib/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const lessonId = Number(req.query.lessonId);
  if (!lessonId) return res.status(400).json({ error: "lessonId required" });
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  const rows = await db
    .select()
    .from(questions)
    .where(eq(questions.lessonId, lessonId));
  res.json(rows);
}
