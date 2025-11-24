import { NextRequest, NextResponse } from "next/server";
import { getStatsByCode } from "@/lib/db";

export async function GET(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params);
  const code = params?.code;
  if (!code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const stats = await getStatsByCode(String(code));
  if (!stats) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(stats);
}