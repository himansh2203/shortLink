import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "links.json");
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

async function readStore() {
  try { const raw = await fs.readFile(DATA_FILE, "utf8"); return JSON.parse(raw); } catch { return []; }
}
async function writeStore(data: any[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}
function genCode(len=6){ const chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; let s=""; for(let i=0;i<len;i++) s+=chars[Math.floor(Math.random()*chars.length)]; return s; }
function validateUrl(u:string){ try{ const url = new URL(u); return url.protocol === "http:" || url.protocol === "https:" }catch{return false}}

export async function GET() {
  const items = await readStore();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const url = (body.url || "").trim();
  let code = body.code ? String(body.code).trim() : "";

  if (!url || !validateUrl(url)) return NextResponse.json({ error: "Invalid or missing url (include http/https)" }, { status: 400 });

  const store = await readStore();

  if (code) {
    if (!CODE_REGEX.test(code)) return NextResponse.json({ error: "Custom code must be 6-8 alphanumeric" }, { status: 400 });
    if (store.find((s:any)=>s.code===code)) return NextResponse.json({ error: "Code exists" }, { status: 409 });
  } else {
    let attempts=0;
    do { code = genCode(6); attempts++; if(attempts>50) code = genCode(8); } while (store.find((s:any)=>s.code===code));
  }

  const created = { code, url, clicks:0, lastClicked:null, createdAt: new Date().toISOString() };
  store.push(created);
  await writeStore(store);

  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
  const shortUrl = `${origin.replace(/\/$/,"")}/${code}`;
  return NextResponse.json({ ...created, shortUrl }, { status: 201 });
}