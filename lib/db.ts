// lib/db.ts
import { Pool } from "pg";

// Configure your PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // add this in your Vercel env variables
  ssl: {
    rejectUnauthorized: false, // for cloud deployments
  },
});

export type Link = {
  code: string;
  url: string;
  createdAt: string;
  clicks: number;
  lastClicked?: string | null;
};

// Create a new link
export async function createLink(code: string, url: string): Promise<Link> {
  const now = new Date().toISOString();
  const res = await pool.query(
    `INSERT INTO links (code, url, created_at, clicks, last_clicked)
     VALUES ($1, $2, $3, 0, NULL)
     RETURNING code, url, created_at AS "createdAt", clicks, last_clicked AS "lastClicked"`,
    [code, url, now]
  );
  return res.rows[0];
}

// Get a link by its code
export async function getLinkByCode(code: string): Promise<Link | null> {
  const res = await pool.query(
    `SELECT code, url, created_at AS "createdAt", clicks, last_clicked AS "lastClicked"
     FROM links WHERE code = $1`,
    [code]
  );
  return res.rows[0] ?? null;
}

// Increment clicks for a link
export async function incrementClick(code: string): Promise<void> {
  await pool.query(
    `UPDATE links
     SET clicks = clicks + 1, last_clicked = $2
     WHERE code = $1`,
    [code, new Date().toISOString()]
  );
}

// Get stats for a link
export async function getStatsByCode(code: string): Promise<{ clicks: number; lastClicked?: string | null } | null> {
  const res = await pool.query(
    `SELECT clicks, last_clicked AS "lastClicked" FROM links WHERE code = $1`,
    [code]
  );
  return res.rows[0] ?? null;
}

// List all links
export async function listLinks(): Promise<Link[]> {
  const res = await pool.query(
    `SELECT code, url, created_at AS "createdAt", clicks, last_clicked AS "lastClicked" FROM links ORDER BY created_at DESC`
  );
  return res.rows;
}

// Delete a link
export async function deleteLink(code: string): Promise<boolean> {
  const res = await pool.query(`DELETE FROM links WHERE code = $1`, [code]);
  return res.rowCount > 0;
}
