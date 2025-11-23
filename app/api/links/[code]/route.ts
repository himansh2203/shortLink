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

export async function GET(_req: Request, context: { params?: Promise<{ code: string }> | { code: string } }) {
  const params = await (context?.params as any);
  const code = String(params?.code ?? "");
  if (!code) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const store = await readStore();
  const item = store.find((s: any) => s.code === code || String(s.code).toLowerCase() === code.toLowerCase());
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(item);
}

export async function DELETE(_req: Request, context: { params?: Promise<{ code: string }> | { code: string } }) {
  const params = await (context?.params as any);
  const code = String(params?.code ?? "");
  if (!code) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const store = await readStore();
  const idx = store.findIndex((s: any) => s.code === code || String(s.code).toLowerCase() === code.toLowerCase());
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  store.splice(idx, 1);
  await writeStore(store);
  return NextResponse.json({ ok: true });
}