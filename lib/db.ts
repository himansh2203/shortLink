import { Pool } from "pg";

// PostgreSQL pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Type for Link
export type Link = {
  code: string;
  url: string;
  createdAt: string;
  clicks: number;
  lastClicked?: string | null;
};

// --- CREATE LINK ---
export async function createLink(code: string, url: string): Promise<Link> {
  const now = new Date().toISOString();
  const query = `
    INSERT INTO links (code, url, created_at, clicks, last_clicked)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const res = await pool.query(query, [code, url, now, 0, null]);
  return res.rows[0] as Link;
}

// --- GET LINK BY CODE ---
export async function getLinkByCode(code: string): Promise<Link | null> {
  const res = await pool.query("SELECT * FROM links WHERE code = $1", [code]);
  return res.rows[0] ?? null;
}

// --- DELETE LINK ---
export async function deleteLink(code: string): Promise<boolean> {
  const res = await pool.query("DELETE FROM links WHERE code = $1", [code]);
  // Handle possible null rowCount safely
  return (res.rowCount ?? 0) > 0;
}

// --- INCREMENT CLICK ---
export async function incrementClick(code: string): Promise<void> {
  const now = new Date().toISOString();
  await pool.query(
    "UPDATE links SET clicks = clicks + 1, last_clicked = $2 WHERE code = $1",
    [code, now]
  );
}

// --- GET STATS ---
export async function getStatsByCode(
  code: string
): Promise<{ clicks: number; lastClicked?: string | null } | null> {
  const res = await pool.query("SELECT clicks, last_clicked FROM links WHERE code = $1", [code]);
  if (!res.rows[0]) return null;
  const { clicks, last_clicked } = res.rows[0];
  return { clicks, lastClicked: last_clicked ?? null };
}

// --- LIST ALL LINKS ---
export async function listLinks(): Promise<Link[]> {
  const res = await pool.query("SELECT * FROM links ORDER BY created_at DESC");
  return res.rows as Link[];
}
