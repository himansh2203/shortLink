import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function createLink(code: string, url: string) {
  const res = await pool.query(
    "INSERT INTO links (code, url, clicks, created_at) VALUES ($1, $2, 0, NOW()) RETURNING *",
    [code, url]
  );
  return res.rows[0];
}

export async function getLinkByCode(code: string) {
  const res = await pool.query("SELECT * FROM links WHERE code = $1", [code]);
  return res.rows[0] ?? null;
}
