import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "links.json");

async function readStore() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as any[];
  } catch {
    return [];
  }
}
async function writeStore(data: any[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}
function ensureProtocol(url: string) {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
}

export async function GET(req: Request, context: { params?: { code?: string } }) {
  // robustly obtain code: prefer params, fallback to pathname
  const codeFromParams = context?.params?.code;
  const codeFromPath = (() => {
    try {
      const p = new URL(req.url).pathname;
      return p.split("/").filter(Boolean).pop();
    } catch {
      return undefined;
    }
  })();
  const code = (codeFromParams ?? codeFromPath ?? "").toString();

  if (!code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const store = await readStore();

  // try exact match first, then case-insensitive
  let item = store.find((s: any) => s.code === code);
  if (!item) {
    const lower = String(code).toLowerCase();
    item = store.find((s: any) => String(s.code).toLowerCase() === lower);
  }

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // update metrics
  item.clicks = (item.clicks || 0) + 1;
  item.lastClicked = new Date().toISOString();
  await writeStore(store);

  const target = ensureProtocol(item.url);
  return NextResponse.redirect(target, 302);
}