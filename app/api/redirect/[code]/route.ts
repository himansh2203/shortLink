import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, incrementClick } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = String(params?.code ?? "");
  if (!code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const link = await getLinkByCode(code);
    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Increment clicks asynchronously (non-blocking)
    incrementClick(code).catch((err) => console.error("Click increment error:", err));

    // Redirect to the original URL
    return NextResponse.redirect(link.url);
  } catch (err) {
    console.error("Redirect error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
