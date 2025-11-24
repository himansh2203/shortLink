import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, incrementClick } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const { code } = params;
    const link = await getLinkByCode(code);

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Increment clicks (non-blocking)
    incrementClick(code).catch(console.error);

    // Redirect
    return NextResponse.redirect(link.url);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
