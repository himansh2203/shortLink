import { NextResponse } from "next/server";
import { createLink, listLinks, getLinkByCode } from "@/lib/db";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

// Generate random 6-character code
function genCode(len = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// Validate URL
function validateUrl(u: string) {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// GET all links
export async function GET() {
  try {
    const links = await listLinks();
    return NextResponse.json(links);
  } catch (err) {
    console.error("GET links error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST create new link
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const url = (body.url || "").trim();
    let code = body.code ? String(body.code).trim() : "";

    if (!url || !validateUrl(url)) {
      return NextResponse.json({ error: "Invalid or missing URL (include http/https)" }, { status: 400 });
    }

    // Check custom code validity
    if (code) {
      if (!CODE_REGEX.test(code)) {
        return NextResponse.json({ error: "Custom code must be 6-8 alphanumeric" }, { status: 400 });
      }
      const existing = await getLinkByCode(code);
      if (existing) return NextResponse.json({ error: "Code exists" }, { status: 409 });
    } else {
      // Auto-generate code until unique
      let attempts = 0;
      do {
        code = genCode(6);
        attempts++;
        if (attempts > 50) code = genCode(8);
      } while (await getLinkByCode(code));
    }

    const created = await createLink(code, url);
    const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
    const shortUrl = `${origin.replace(/\/$/, "")}/${created.code}`;

    return NextResponse.json({ ...created, shortUrl }, { status: 201 });
  } catch (err) {
    console.error("POST links error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
