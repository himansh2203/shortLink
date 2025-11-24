import { NextResponse, NextRequest } from "next/server";
import { getLinkByCode, incrementClick } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const params = await context.params;
  const code = String(params.code);

  if (!code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const link = await getLinkByCode(code);
  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Increment click count (non-blocking)
  incrementClick(code).catch(console.error);

  return NextResponse.redirect(link.url);
}
// --- CREATE LINK ---
// --- GET LINK BY CODE ---
// --- DELETE LINK ---
// --- INCREMENT CLICK ---
// --- GET STATS BY CODE ---
