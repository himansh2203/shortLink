import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, incrementClick } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: { code: string } } // make it a plain object
) {
  const { code } = context.params;
  if (!code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const link = await getLinkByCode(code);
  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Increment clicks asynchronously, don't block redirect
  incrementClick(code).catch(console.error);

  return NextResponse.redirect(link.url);
}
