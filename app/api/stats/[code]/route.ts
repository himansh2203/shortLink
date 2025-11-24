import { NextRequest, NextResponse } from "next/server";
import { getStatsByCode } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const { code } = params;
    const stats = await getStatsByCode(code);
    if (!stats) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }
    return NextResponse.json(stats);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
