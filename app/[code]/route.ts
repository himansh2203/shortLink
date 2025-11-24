import { NextResponse } from "next/server";
import { getLinkByCode, incrementClick } from "@/lib/db";

export async function GET(request: Request, context: any) {
  // context.params may be a Promise in some Next versions/tools — use any to avoid type-check mismatch
  const code = (context?.params && (await Promise.resolve(context.params)).code) || undefined;
  if (!code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const link = await getLinkByCode(String(code));
  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // increment click count (fire-and-forget is fine, but await to persist)
  try {
    await incrementClick(String(code));
  } catch {
    /* ignore increment failures */
  }

  return NextResponse.redirect(link.url);
}