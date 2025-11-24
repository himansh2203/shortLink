import { NextRequest, NextResponse } from "next/server";
import { getStatsByCode } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = String(params?.code ?? "");
  if (!code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const stats = await getStatsByCode(code);
    if (!stats) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(stats);
  } catch (err) {
    console.error("Stats fetch error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
