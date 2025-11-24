import { NextResponse } from "next/server";
import { getStatsByCode } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ code: string }> } // params as Promise
) {
  const params = await context.params; // await the promise
  const code = String(params.code);

 const stats = await getStatsByCode(code);
  if (!stats) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(stats);
}
// --- CREATE LINK ---
// --- GET LINK BY CODE ---
// --- DELETE LINK ---
// --- INCREMENT CLICK ---
// --- GET STATS BY CODE ---
