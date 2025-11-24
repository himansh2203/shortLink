import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, incrementClick } from "@/lib/db";

export async function GET(request: NextRequest, context: any) {
  // context.params may be a Promise in some Next versions/tools — normalize it
  const params = await Promise.resolve(context?.params);
  const code = params?.code;
  if (!code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const link = await getLinkByCode(String(code));
  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await incrementClick(String(code));
  } catch {
    // ignore increment errors
  }

  return NextResponse.redirect(link.url);
}